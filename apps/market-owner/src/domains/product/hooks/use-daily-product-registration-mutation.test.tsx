import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { registerDailyProduct } from '../api/register-daily-product';
import { useDailyProductRegistrationMutation } from './use-daily-product-registration-mutation';

vi.mock('../api/register-daily-product', () => ({
  registerDailyProduct: vi.fn(),
}));

const mockedRegisterDailyProduct = vi.mocked(registerDailyProduct);

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

describe('useDailyProductRegistrationMutation', () => {
  beforeEach(() => {
    mockedRegisterDailyProduct.mockReset();
  });

  it('passes the market and product request to the API helper', async () => {
    const params = {
      marketId: 12,
      request: {
        name: '토마토',
        category: 'VEGETABLE_FRUIT' as const,
        originalPrice: 5000,
        discountedPrice: 4500,
        discountStartDate: '2026-06-30',
        discountEndDate: '2026-06-30',
      },
    };
    const response = {
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    };

    mockedRegisterDailyProduct.mockResolvedValue(response);

    const { result } = renderHook(() => useDailyProductRegistrationMutation(), {
      wrapper: createWrapper(),
    });

    await expect(
      act(async () => {
        return result.current.mutateAsync(params);
      }),
    ).resolves.toEqual(response);
    expect(mockedRegisterDailyProduct).toHaveBeenCalledWith(params);
  });
});
