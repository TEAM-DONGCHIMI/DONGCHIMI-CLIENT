import { type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api';
import { createQueryClient } from '@/shared/query';

import { getProductSearch, type GetProductSearchResponseTypes } from '../api/get-product-search';
import { productSearchQueryOptions } from '../query-options';

import { useProductSearchQuery } from './use-product-search-query';

vi.mock('../api/get-product-search', () => ({
  getProductSearch: vi.fn(),
}));

const mockedGetProductSearch = vi.mocked(getProductSearch);

const productSearchResponse: GetProductSearchResponseTypes = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    products: [
      {
        productId: 101,
        name: '풀무원 두부 1팩',
        dealType: 'DAILY',
      },
    ],
  },
};

const createWrapper = () => {
  const queryClient = createQueryClient();
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return { queryClient, TestQueryProvider };
};

describe('useProductSearchQuery', () => {
  beforeEach(() => {
    mockedGetProductSearch.mockReset();
  });

  it('does not request products for a blank keyword', () => {
    const { TestQueryProvider } = createWrapper();

    const { result } = renderHook(
      () => useProductSearchQuery({ keyword: '   ', marketId: 1, size: 10 }),
      { wrapper: TestQueryProvider },
    );

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedGetProductSearch).not.toHaveBeenCalled();
  });

  it('uses the product search query key and exposes validated data', async () => {
    const { queryClient, TestQueryProvider } = createWrapper();
    mockedGetProductSearch.mockResolvedValue(productSearchResponse);

    const { result } = renderHook(
      () => useProductSearchQuery({ keyword: '풀무원', marketId: 1, size: 10 }),
      { wrapper: TestQueryProvider },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetProductSearch).toHaveBeenCalledWith({
      keyword: '풀무원',
      marketId: 1,
      size: 10,
    });
    expect(
      queryClient.getQueryData(
        productSearchQueryOptions({ keyword: '풀무원', marketId: 1, size: 10 }).queryKey,
      ),
    ).toEqual(productSearchResponse);
  });

  it('does not retry a 400 keyword validation error', async () => {
    const { TestQueryProvider } = createWrapper();
    const apiError = new ApiError({
      code: 'INVALID_SEARCH_KEYWORD',
      message: '검색 키워드를 입력해주세요.',
      status: 400,
      type: 'validation',
    });
    mockedGetProductSearch.mockRejectedValue(apiError);

    const { result } = renderHook(
      () => useProductSearchQuery({ keyword: '풀무원', marketId: 1, size: 10 }),
      { wrapper: TestQueryProvider },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(apiError);
    expect(mockedGetProductSearch).toHaveBeenCalledTimes(1);
  });
});
