import { act, renderHook, waitFor } from '@/test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { refreshAuthSession } from '@/shared/api';
import { useAuthStore } from '@/shared/stores/auth-store';

import { useAuthBootstrap } from './use-auth-bootstrap';

vi.mock('@/shared/api', () => ({
  refreshAuthSession: vi.fn(),
}));

const mockRefreshAuthSession = vi.mocked(refreshAuthSession);

describe('useAuthBootstrap', () => {
  beforeEach(() => {
    mockRefreshAuthSession.mockReset();
    useAuthStore.getState().clearSession();
    localStorage.clear();
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
  });

  it('refreshes access token on app bootstrap when the persisted login hint exists', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshAuthSession.mockImplementationOnce(async () => {
      useAuthStore.getState().setAccessToken('refreshed-access-token');

      return 'refreshed-access-token';
    });

    renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('refreshed-access-token');
    });
    expect(useAuthStore.getState().bootstrapStatus).toBe('authenticated');
    expect(mockRefreshAuthSession).toHaveBeenCalledTimes(1);
  });

  it('skips refresh when there is no login hint', () => {
    renderHook(() => useAuthBootstrap());

    expect(useAuthStore.getState().bootstrapStatus).toBe('unauthenticated');
    expect(mockRefreshAuthSession).not.toHaveBeenCalled();
  });

  it('marks bootstrap as refreshing while refresh request is pending', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshAuthSession.mockImplementationOnce(() => new Promise(() => undefined));

    renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(useAuthStore.getState().bootstrapStatus).toBe('refreshing');
    });
  });

  it('clears login hint when bootstrap refresh fails', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshAuthSession.mockRejectedValueOnce(new Error('refresh failed'));

    renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });
    expect(useAuthStore.getState().bootstrapStatus).toBe('unauthenticated');
    expect(useAuthStore.getState().accessToken).toBeUndefined();
  });

  it('requests refresh once when StrictMode reruns the bootstrap effect', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshAuthSession.mockImplementationOnce(() => new Promise(() => undefined));

    renderHook(() => useAuthBootstrap(), { reactStrictMode: true });

    expect(mockRefreshAuthSession).toHaveBeenCalledTimes(1);
  });

  it('allows refresh again after a restored access token is cleared', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshAuthSession
      .mockImplementationOnce(async () => {
        useAuthStore.getState().setAccessToken('refreshed-access-token');

        return 'refreshed-access-token';
      })
      .mockImplementationOnce(() => new Promise(() => undefined));

    renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(useAuthStore.getState().bootstrapStatus).toBe('authenticated');
    });

    act(() => {
      useAuthStore.getState().clearAccessToken();
    });

    await waitFor(() => {
      expect(mockRefreshAuthSession).toHaveBeenCalledTimes(2);
    });
  });
});
