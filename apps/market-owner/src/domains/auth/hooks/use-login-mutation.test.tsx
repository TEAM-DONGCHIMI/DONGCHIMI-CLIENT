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

const LOGIN_SUCCESS_RESPONSE = {
  success: true,
  code: 'SUCCESS',
  message: 'ok',
  data: {
    accessToken: 'access-token',
    ownerId: 1,
    email: 'owner@example.com',
    marketId: 10,
    marketName: '동치미 마트',
    marketThumbnailUrl: 'https://static.dongchimi.kr/market.png',
  },
} as const;

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

const submitLogin = async (isAutoLogin: boolean) => {
  mockLoginMarketOwner.mockResolvedValueOnce(LOGIN_SUCCESS_RESPONSE);

  const { result } = renderHook(() => useLoginMutation(), {
    wrapper: createWrapper(),
  });

  await act(async () => {
    await result.current.mutateAsync({
      email: 'owner@example.com',
      password: 'password',
      isAutoLogin,
    });
  });
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
    await submitLogin(false);

    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(useAuthStore.getState().marketId).toBe(10);
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('access-token');
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).toContain('"isLoggedIn":true');
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).toContain('"marketId":10');
  });

  it('stores the login hint in local storage when auto login succeeds', async () => {
    await submitLogin(true);

    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(useAuthStore.getState().marketId).toBe(10);
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('access-token');
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toContain('"isLoggedIn":true');
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBeNull();
  });

  it('stores the market context returned by login', async () => {
    mockLoginMarketOwner.mockResolvedValueOnce({
      ...LOGIN_SUCCESS_RESPONSE,
      data: {
        ...LOGIN_SUCCESS_RESPONSE.data,
        marketId: 12,
      },
    });
    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'owner@example.com',
        password: 'password',
        isAutoLogin: true,
      });
    });

    expect(useAuthStore.getState().marketId).toBe(12);
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toContain('"marketId":12');
  });
});
