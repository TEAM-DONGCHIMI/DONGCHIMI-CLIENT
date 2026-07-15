import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { ToastProvider } from '@dongchimi/shared/toast';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteProduct, deleteProducts, resetProducts } from '../api/delete-products';
import { productListQueryOptions } from '../query-options';
import { productQueryKeys } from '../query-keys';
import { useProductDeletionActions } from './use-product-deletion-actions';

vi.mock('../api/delete-products', () => ({
  deleteProduct: vi.fn(),
  deleteProducts: vi.fn(),
  resetProducts: vi.fn(),
}));

const mockedResetProducts = vi.mocked(resetProducts);
const mockedDeleteProduct = vi.mocked(deleteProduct);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  const TestProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );

  TestProvider.displayName = 'TestProvider';

  return { queryClient, wrapper: TestProvider };
};

describe('useProductDeletionActions', () => {
  beforeEach(() => {
    mockedDeleteProduct.mockReset();
    vi.mocked(deleteProducts).mockReset();
    mockedResetProducts.mockReset();
  });

  it('deletes one product, removes its detail cache, and invalidates market lists', async () => {
    const { queryClient, wrapper } = createWrapper();
    const detailKey = productQueryKeys.detail({ marketId: 1, productId: 101 });
    const listKey = productListQueryOptions({ marketId: 1, type: 'DAILY' }).queryKey;

    queryClient.setQueryData(detailKey, { data: { productId: 101 } });
    queryClient.setQueryData(listKey, {
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: { content: [], hasNext: false, nextCursor: null },
    });
    mockedDeleteProduct.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });

    const { result } = renderHook(() => useProductDeletionActions(1), { wrapper });

    await expect(act(async () => result.current.deleteProduct(101))).resolves.toBe(true);
    expect(mockedDeleteProduct).toHaveBeenCalledWith({
      marketId: 1,
      productId: 101,
      request: { forceDelete: true },
    });
    expect(queryClient.getQueryData(detailKey)).toBeUndefined();
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
  });

  it('resets one deal type and invalidates every product list for the target market', async () => {
    const { queryClient, wrapper } = createWrapper();
    const targetDailyKey = productListQueryOptions({ marketId: 1, type: 'DAILY' }).queryKey;
    const targetPeriodicKey = productListQueryOptions({ marketId: 1, type: 'PERIODIC' }).queryKey;
    const anotherMarketKey = productListQueryOptions({ marketId: 2, type: 'DAILY' }).queryKey;
    const emptyProductListResponse = {
      success: true as const,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: { content: [], hasNext: false, nextCursor: null },
    };

    queryClient.setQueryData(targetDailyKey, emptyProductListResponse);
    queryClient.setQueryData(targetPeriodicKey, emptyProductListResponse);
    queryClient.setQueryData(anotherMarketKey, emptyProductListResponse);
    mockedResetProducts.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });

    const { result } = renderHook(() => useProductDeletionActions(1), { wrapper });

    await expect(act(async () => result.current.resetProducts('DAILY'))).resolves.toBe(true);
    expect(mockedResetProducts).toHaveBeenCalledWith({
      marketId: 1,
      request: { dealType: 'DAILY', forceDelete: true },
    });
    expect(queryClient.getQueryState(targetDailyKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(targetPeriodicKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(anotherMarketKey)?.isInvalidated).toBe(false);
  });
});
