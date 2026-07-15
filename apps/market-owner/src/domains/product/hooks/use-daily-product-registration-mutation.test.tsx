import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/shared/query';

import { registerDailyProduct } from '../api/register-daily-product';
import { productQueryKeys } from '../query-keys';
import { useDailyProductRegistrationMutation } from './use-daily-product-registration-mutation';

vi.mock('../api/register-daily-product', () => ({
  registerDailyProduct: vi.fn(),
}));

const mockedRegisterDailyProduct = vi.mocked(registerDailyProduct);

const createWrapper = (queryClient: QueryClient) => {
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
    const queryClient = createQueryClient();

    const { result } = renderHook(() => useDailyProductRegistrationMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      act(async () => {
        return result.current.mutateAsync(params);
      }),
    ).resolves.toEqual(response);
    expect(mockedRegisterDailyProduct).toHaveBeenCalledWith(params);
  });

  it('invalidates daily and periodic product lists after registration succeeds', async () => {
    const params = {
      marketId: 1,
      request: {
        name: '토마토',
        category: 'VEGETABLE_FRUIT' as const,
        originalPrice: 5000,
        discountedPrice: 4500,
        discountStartDate: '2026-06-30',
        discountEndDate: '2026-06-30',
      },
    };
    const queryClient = createQueryClient();
    const dailyListQueryKey = [
      ...productQueryKeys.listRoot,
      { marketId: 1, sort: 'CATEGORY', type: 'DAILY' },
    ] as const;
    const periodicListQueryKey = [
      ...productQueryKeys.listRoot,
      { marketId: 1, sort: 'CATEGORY', type: 'PERIODIC' },
    ] as const;

    queryClient.setQueryData(dailyListQueryKey, { data: { content: [] } });
    queryClient.setQueryData(periodicListQueryKey, { data: { content: [] } });
    mockedRegisterDailyProduct.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });

    const { result } = renderHook(() => useDailyProductRegistrationMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(params);
    });

    expect(queryClient.getQueryState(dailyListQueryKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(periodicListQueryKey)?.isInvalidated).toBe(true);
  });
});
