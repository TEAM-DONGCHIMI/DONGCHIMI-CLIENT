import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useGeolocation } from './use-geolocation';

const createPermissionStatusMock = (getState: () => PermissionState) => {
  const permissionStatus = new EventTarget() as PermissionStatus;

  Object.defineProperty(permissionStatus, 'state', {
    get: getState,
  });

  return permissionStatus;
};

const createPosition = (latitude: number, longitude: number) =>
  ({
    coords: {
      latitude,
      longitude,
    },
  }) as GeolocationPosition;

const createGeolocationError = (code: number) =>
  ({
    code,
  }) as GeolocationPositionError;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useGeolocation', () => {
  it('does not apply the position timeout while the browser permission prompt is pending', async () => {
    const permissionStatus = createPermissionStatusMock(() => 'prompt');
    const getCurrentPosition = vi.fn();

    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition,
      },
      permissions: {
        query: vi.fn().mockResolvedValue(permissionStatus),
      },
    });

    renderHook(() => useGeolocation());

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalled());

    expect(getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.not.objectContaining({ timeout: expect.any(Number) }),
    );
  });

  it('requests the position again when permission becomes granted after a timeout', async () => {
    let permissionState: PermissionState = 'prompt';
    let successCallback: PositionCallback | undefined;
    let errorCallback: PositionErrorCallback | undefined;
    const permissionStatus = createPermissionStatusMock(() => permissionState);
    const getCurrentPosition = vi.fn(
      (success: PositionCallback, error: PositionErrorCallback | null | undefined) => {
        successCallback = success;
        errorCallback = error ?? undefined;
      },
    );

    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition,
      },
      permissions: {
        query: vi.fn().mockResolvedValue(permissionStatus),
      },
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalledTimes(1));

    act(() => {
      errorCallback?.(createGeolocationError(3));
    });

    await waitFor(() => expect(result.current.errorCode).toBe('TIMEOUT'));

    act(() => {
      permissionState = 'granted';
      permissionStatus.dispatchEvent(new Event('change'));
    });

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalledTimes(2));

    act(() => {
      successCallback?.(createPosition(37.5665, 126.978));
    });

    await waitFor(() => expect(result.current.coordinates).toEqual({ lat: 37.5665, lng: 126.978 }));
  });

  it('retries the position request once when the window regains focus after a timeout', async () => {
    let successCallback: PositionCallback | undefined;
    let errorCallback: PositionErrorCallback | undefined;
    const getCurrentPosition = vi.fn(
      (success: PositionCallback, error: PositionErrorCallback | null | undefined) => {
        successCallback = success;
        errorCallback = error ?? undefined;
      },
    );

    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition,
      },
    });

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalledTimes(1));

    act(() => {
      errorCallback?.(createGeolocationError(3));
    });

    await waitFor(() => expect(result.current.errorCode).toBe('TIMEOUT'));

    expect(addEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function), {
      once: true,
    });

    act(() => {
      window.dispatchEvent(new Event('focus'));
      window.dispatchEvent(new Event('focus'));
    });

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalledTimes(2));

    const focusHandler = addEventListenerSpy.mock.calls.find(([type]) => type === 'focus')?.[1];

    await waitFor(() => expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', focusHandler));

    act(() => {
      successCallback?.(createPosition(37.5665, 126.978));
    });

    await waitFor(() => expect(result.current.coordinates).toEqual({ lat: 37.5665, lng: 126.978 }));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('removes the focus listener when unmounted while awaiting a retry', async () => {
    let errorCallback: PositionErrorCallback | undefined;
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, error: PositionErrorCallback | null | undefined) => {
        errorCallback = error ?? undefined;
      },
    );

    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition,
      },
    });

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { result, unmount } = renderHook(() => useGeolocation());

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalledTimes(1));

    act(() => {
      errorCallback?.(createGeolocationError(3));
    });

    await waitFor(() => expect(result.current.errorCode).toBe('TIMEOUT'));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
