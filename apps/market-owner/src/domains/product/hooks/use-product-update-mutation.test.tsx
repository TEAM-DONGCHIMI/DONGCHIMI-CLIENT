import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/shared/query';

import { updateProduct, type UpdateProductParams } from '../api/update-product';
import { productQueryKeys } from '../query-keys';
import { useProductUpdateMutation } from './use-product-update-mutation';

vi.mock('../api/update-product', () => ({
  updateProduct: vi.fn(),
}));

const mockedUpdateProduct = vi.mocked(updateProduct);

const createWrapper = (queryClient: QueryClient) => {
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return TestQueryProvider;
};

const params: UpdateProductParams = {
  marketId: 1,
  productId: 101,
  request: {
    type: 'DAILY',
    name: '삼겹살 500g',
    category: 'MEAT_EGG',
    originalPrice: 22000,
    discountedPrice: 19500,
    discountStartDate: '2026-06-30',
    discountEndDate: '2026-06-30',
  },
};

describe('useProductUpdateMutation', () => {
  beforeEach(() => {
    mockedUpdateProduct.mockReset();
  });

  it('passes the product update params to the API helper', async () => {
    const response = { success: true, code: 'SUCCESS', message: '요청에 성공했습니다.' };
    mockedUpdateProduct.mockResolvedValue(response);
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useProductUpdateMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      act(async () => {
        return result.current.mutateAsync(params);
      }),
    ).resolves.toEqual(response);
    expect(mockedUpdateProduct).toHaveBeenCalledWith(params);
  });

  it('invalidates the product lists and updated product detail after success', async () => {
    const queryClient = createQueryClient();
    const listQueryKey = [
      ...productQueryKeys.listRoot,
      { marketId: 1, sort: 'CATEGORY', type: 'DAILY' },
    ] as const;
    const detailQueryKey = productQueryKeys.detail({ marketId: 1, productId: 101 });

    queryClient.setQueryData(listQueryKey, { data: { content: [] } });
    queryClient.setQueryData(detailQueryKey, { data: { productId: 101 } });
    mockedUpdateProduct.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });

    const { result } = renderHook(() => useProductUpdateMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(params);
    });

    expect(queryClient.getQueryState(listQueryKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(detailQueryKey)?.isInvalidated).toBe(true);
  });
});
