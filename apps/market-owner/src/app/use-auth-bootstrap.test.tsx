import { renderHook, waitFor } from '@/test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { refreshMarketOwnerAuth } from '@/domains/auth/api/auth-api';
import { useAuthStore } from '@/shared/stores/auth-store';

import { useAuthBootstrap } from './use-auth-bootstrap';

vi.mock('@/domains/auth/api/auth-api', () => ({
  refreshMarketOwnerAuth: vi.fn(),
}));

const mockRefreshMarketOwnerAuth = vi.mocked(refreshMarketOwnerAuth);

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
    expect(mockRefreshMarketOwnerAuth).toHaveBeenCalledTimes(1);
  });

  it('skips refresh when there is no login hint', () => {
    renderHook(() => useAuthBootstrap());

    expect(mockRefreshMarketOwnerAuth).not.toHaveBeenCalled();
  });

  it('clears login hint when bootstrap refresh fails', async () => {
    useAuthStore.getState().setLoggedIn(true);
    mockRefreshMarketOwnerAuth.mockRejectedValueOnce(new Error('refresh failed'));

    renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });
    expect(useAuthStore.getState().accessToken).toBeUndefined();
  });
});
