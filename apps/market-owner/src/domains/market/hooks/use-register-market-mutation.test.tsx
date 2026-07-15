import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { registerMarket } from '../api';
import { useRegisterMarketMutation } from './use-register-market-mutation';

vi.mock('../api', () => ({ registerMarket: vi.fn() }));

const mockRegisterMarket = vi.mocked(registerMarket);
const { setMarketId } = vi.hoisted(() => ({ setMarketId: vi.fn() }));

vi.mock('@/shared/stores/auth-store', () => ({
  useAuthStore: {
    getState: () => ({ setMarketId }),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return TestQueryProvider;
};

describe('useRegisterMarketMutation', () => {
  beforeEach(() => {
    mockRegisterMarket.mockReset();
    setMarketId.mockReset();
  });

  it('stores the registered market id when registration succeeds', async () => {
    mockRegisterMarket.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: '등록되었습니다.',
      data: { marketId: 24 },
    });
    const { result } = renderHook(() => useRegisterMarketMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({} as Parameters<typeof registerMarket>[0]);
    });

    expect(setMarketId).toHaveBeenCalledWith(24);
  });
});
