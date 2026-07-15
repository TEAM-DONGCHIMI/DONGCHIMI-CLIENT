import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_STORE_STORAGE_KEY, useAuthStore } from '@/shared/stores/auth-store';

import { signupMarketOwner } from '../api/auth-api';
import { useSignupMutation } from './use-signup-mutation';

vi.mock('../api/auth-api', () => ({
  signupMarketOwner: vi.fn(),
}));

const mockSignupMarketOwner = vi.mocked(signupMarketOwner);

const SIGNUP_SUCCESS_RESPONSE = {
  success: true,
  code: 'SUCCESS',
  message: 'ok',
  data: {
    accessToken: 'signup-access-token',
    ownerId: 1,
    email: 'owner@example.com',
    marketId: null,
    marketName: null,
    marketThumbnailUrl: null,
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

describe('useSignupMutation', () => {
  beforeEach(() => {
    mockSignupMarketOwner.mockReset();
    useAuthStore.getState().clearSession();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('stores the access token and login hint when signup succeeds', async () => {
    mockSignupMarketOwner.mockResolvedValueOnce(SIGNUP_SUCCESS_RESPONSE);

    const { result } = renderHook(() => useSignupMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'owner@example.com',
        password: 'password',
      });
    });

    expect(useAuthStore.getState().accessToken).toBe('signup-access-token');
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('signup-access-token');
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toContain('"isLoggedIn":true');
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBeNull();
  });
});
