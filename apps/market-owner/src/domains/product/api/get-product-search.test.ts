import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { getProductSearch } from './get-product-search';

vi.mock('@/shared/api', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(httpClient.get);

const productSearchResponse = {
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
      {
        productId: 201,
        name: '풀무원 콩나물 100g',
        dealType: 'PERIODIC',
      },
    ],
  },
} as const;

describe('getProductSearch', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('gets trimmed product search results with the default size', async () => {
    mockedGet.mockResolvedValue(productSearchResponse);

    await expect(getProductSearch({ keyword: '  풀무원  ', marketId: 1 })).resolves.toEqual(
      productSearchResponse,
    );
    expect(mockedGet).toHaveBeenCalledWith(
      API_ENDPOINTS.owner.products.search(1, {
        keyword: '풀무원',
        size: 10,
      }),
    );
  });

  it('keeps an empty products response as a successful search', async () => {
    const emptyResponse = {
      ...productSearchResponse,
      data: {
        products: [],
      },
    };
    mockedGet.mockResolvedValue(emptyResponse);

    await expect(getProductSearch({ keyword: '없는상품', marketId: 1, size: 5 })).resolves.toEqual(
      emptyResponse,
    );
  });

  it('rejects a response that does not match the OpenAPI success contract', async () => {
    mockedGet.mockResolvedValue({
      ...productSearchResponse,
      data: {
        products: [{ productId: 101, name: '풀무원 두부 1팩', dealType: 'UNKNOWN' }],
      },
    });

    await expect(getProductSearch({ keyword: '풀무원', marketId: 1 })).rejects.toSatisfy(
      isApiResponseValidationError,
    );
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'INVALID_INPUT',
      message: '검색어는 필수입니다.',
      status: 400,
      type: 'validation',
    });

    mockedGet.mockRejectedValue(apiError);

    await expect(getProductSearch({ keyword: '풀무원', marketId: 1 })).rejects.toBe(apiError);
  });
});
