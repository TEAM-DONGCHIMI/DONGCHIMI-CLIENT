import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_STORE_STORAGE_KEY, useAuthStore } from '@/shared/stores/auth-store';

import { loginMarketOwner } from '../api/auth-api';
import { useLoginMutation } from './use-login-mutation';

vi.mock('../api/auth-api', () => ({
  loginMarketOwner: vi.fn(),
}));

const mockLoginMarketOwner = vi.mocked(loginMarketOwner);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return TestQueryProvider;
};

describe('useLoginMutation', () => {
  beforeEach(() => {
    mockLoginMarketOwner.mockReset();
    useAuthStore.getState().clearSession();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('passes isAutoLogin to the auth store when login succeeds', async () => {
    mockLoginMarketOwner.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        accessToken: 'access-token',
        ownerId: 1,
        email: 'owner@example.com',
        marketId: null,
        marketName: null,
        marketThumbnailUrl: null,
      },
    });

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'owner@example.com',
        password: 'password',
        isAutoLogin: false,
      });
    });

    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('access-token');
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).toContain('"isLoggedIn":true');
  });
});
