import { renderHook, waitFor } from '@/test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { refreshMarketOwnerAuth } from '@/domains/auth/api/auth-api';
import { useAuthStore } from '@/shared/stores/auth-store';

import { useAuthBootstrap } from './use-auth-bootstrap';

vi.mock('@/domains/auth/api/auth-api', () => ({
  refreshMarketOwnerAuth: vi.fn(),
}));

const mockRefreshMarketOwnerAuth = vi.mocked(refreshMarketOwnerAuth);

const createDeferredRefreshResponse = () => {
  let resolve!: (value: Awaited<ReturnType<typeof refreshMarketOwnerAuth>>) => void;
  const promise = new Promise<Awaited<ReturnType<typeof refreshMarketOwnerAuth>>>(
    (promiseResolve) => {
      resolve = promiseResolve;
    },
  );

  return { promise, resolve };
};

describe('useAuthBootstrap', () => {
  beforeEach(() => {
    mockRefreshMarketOwnerAuth.mockReset();
    useAuthStore.getState().clearSession();
    localStorage.clear();
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
  });

  it('refreshes access token on app bootstrap when the persisted login hint exists', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshMarketOwnerAuth.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        accessToken: 'refreshed-access-token',
      },
    });

    renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('refreshed-access-token');
    });
    expect(useAuthStore.getState().bootstrapStatus).toBe('authenticated');
    expect(mockRefreshMarketOwnerAuth).toHaveBeenCalledTimes(1);
  });

  it('skips refresh when there is no login hint', () => {
    renderHook(() => useAuthBootstrap());

    expect(useAuthStore.getState().bootstrapStatus).toBe('unauthenticated');
    expect(mockRefreshMarketOwnerAuth).not.toHaveBeenCalled();
  });

  it('marks bootstrap as refreshing while refresh request is pending', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshMarketOwnerAuth.mockImplementationOnce(() => new Promise(() => undefined));

    renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(useAuthStore.getState().bootstrapStatus).toBe('refreshing');
    });
  });

  it('clears login hint when bootstrap refresh fails', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshMarketOwnerAuth.mockRejectedValueOnce(new Error('refresh failed'));

    renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });
    expect(useAuthStore.getState().bootstrapStatus).toBe('unauthenticated');
    expect(useAuthStore.getState().accessToken).toBeUndefined();
  });

  it('keeps the refresh result when the bootstrap effect is cleaned up while still logged in', async () => {
    useAuthStore.getState().setLoggedIn(true);
    const deferredRefresh = createDeferredRefreshResponse();
    mockRefreshMarketOwnerAuth.mockReturnValueOnce(deferredRefresh.promise);

    const { unmount } = renderHook(() => useAuthBootstrap());

    unmount();
    deferredRefresh.resolve({
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        accessToken: 'strict-mode-access-token',
      },
    });

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('strict-mode-access-token');
    });
    expect(useAuthStore.getState().bootstrapStatus).toBe('authenticated');
  });

  it('skips applying the refresh result after the user logs out', async () => {
    useAuthStore.getState().setLoggedIn(true);
    const deferredRefresh = createDeferredRefreshResponse();
    mockRefreshMarketOwnerAuth.mockReturnValueOnce(deferredRefresh.promise);

    renderHook(() => useAuthBootstrap());

    useAuthStore.getState().clearSession();
    deferredRefresh.resolve({
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        accessToken: 'ignored-access-token',
      },
    });

    await waitFor(() => {
      expect(useAuthStore.getState().bootstrapStatus).toBe('unauthenticated');
    });
    expect(useAuthStore.getState().accessToken).toBeUndefined();
  });
});
