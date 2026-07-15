import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/shared/query';

import {
  updateProductDiscountPeriod,
  type UpdateProductDiscountPeriodParams,
} from '../api/update-product-discount-period';
import { productQueryKeys } from '../query-keys';
import { useProductDiscountPeriodUpdateMutation } from './use-product-discount-period-update-mutation';

vi.mock('../api/update-product-discount-period', () => ({
  updateProductDiscountPeriod: vi.fn(),
}));

const mockedUpdateProductDiscountPeriod = vi.mocked(updateProductDiscountPeriod);
const params: UpdateProductDiscountPeriodParams = {
  marketId: 1,
  request: {
    discountStartDate: '2026-06-30',
    discountEndDate: '2026-07-02',
    productIds: [101, 102],
  },
};

const createWrapper = (queryClient: QueryClient) => {
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return TestQueryProvider;
};

describe('useProductDiscountPeriodUpdateMutation', () => {
  beforeEach(() => {
    mockedUpdateProductDiscountPeriod.mockReset();
  });

  it('passes the bulk period update params to the API helper', async () => {
    const response = { success: true, code: 'SUCCESS', message: '요청에 성공했습니다.' };
    mockedUpdateProductDiscountPeriod.mockResolvedValue(response);
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useProductDiscountPeriodUpdateMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      act(async () => {
        return result.current.mutateAsync(params);
      }),
    ).resolves.toEqual(response);
    expect(mockedUpdateProductDiscountPeriod).toHaveBeenCalledWith(params);
  });

  it('invalidates product lists and every selected product detail after success', async () => {
    const queryClient = createQueryClient();
    const listQueryKey = [
      ...productQueryKeys.listRoot,
      { marketId: 1, sort: 'CATEGORY', type: 'PERIODIC' },
    ] as const;
    const firstDetailQueryKey = productQueryKeys.detail({ marketId: 1, productId: 101 });
    const secondDetailQueryKey = productQueryKeys.detail({ marketId: 1, productId: 102 });

    queryClient.setQueryData(listQueryKey, { data: { content: [] } });
    queryClient.setQueryData(firstDetailQueryKey, { data: { productId: 101 } });
    queryClient.setQueryData(secondDetailQueryKey, { data: { productId: 102 } });
    mockedUpdateProductDiscountPeriod.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });

    const { result } = renderHook(() => useProductDiscountPeriodUpdateMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(params);
    });

    expect(queryClient.getQueryState(listQueryKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(firstDetailQueryKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(secondDetailQueryKey)?.isInvalidated).toBe(true);
  });
});
