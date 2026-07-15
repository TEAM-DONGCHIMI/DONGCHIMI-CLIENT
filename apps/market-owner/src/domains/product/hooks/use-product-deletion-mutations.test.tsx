import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteProduct, deleteProducts } from '../api/delete-products';
import {
  useBulkProductDeletionMutation,
  useProductDeletionMutation,
} from './use-product-deletion-mutations';

vi.mock('../api/delete-products', () => ({
  deleteProduct: vi.fn(),
  deleteProducts: vi.fn(),
}));

const mockedDeleteProduct = vi.mocked(deleteProduct);
const mockedDeleteProducts = vi.mocked(deleteProducts);

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

describe('product deletion mutations', () => {
  beforeEach(() => {
    mockedDeleteProduct.mockReset();
    mockedDeleteProducts.mockReset();
  });

  it('passes one product id to the individual deletion helper', async () => {
    const params = { marketId: 12, productId: 34, request: { forceDelete: true } };
    const response = { success: true, code: 'SUCCESS', message: '요청에 성공했습니다.' };

    mockedDeleteProduct.mockResolvedValue(response);

    const { result } = renderHook(() => useProductDeletionMutation(), {
      wrapper: createWrapper(),
    });

    await expect(act(async () => result.current.mutateAsync(params))).resolves.toEqual(response);
    expect(mockedDeleteProduct).toHaveBeenCalledWith(params);
  });

  it('passes selected product ids to the bulk deletion helper', async () => {
    const params = {
      marketId: 12,
      request: { forceDelete: true, productIds: [1, 2, 3] },
    };
    const response = { success: true, code: 'SUCCESS', message: '요청에 성공했습니다.' };

    mockedDeleteProducts.mockResolvedValue(response);

    const { result } = renderHook(() => useBulkProductDeletionMutation(), {
      wrapper: createWrapper(),
    });

    await expect(act(async () => result.current.mutateAsync(params))).resolves.toEqual(response);
    expect(mockedDeleteProducts).toHaveBeenCalledWith(params);
  });
});
