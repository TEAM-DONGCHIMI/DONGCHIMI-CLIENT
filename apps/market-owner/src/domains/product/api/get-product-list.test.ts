import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { getProductList } from './get-product-list';

vi.mock('@/shared/api', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(httpClient.get);

const productListResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    content: [
      {
        productId: 101,
        name: '삼겹살 500g',
        thumbnailUrl: 'https://cdn.dongchimi.kr/products/101.png',
        category: 'MEAT_EGG',
        categoryName: '정육/달걀',
        originalPrice: 5000,
        discountedPrice: 4500,
        promotionalPhrase: '이번 주 한정 특가',
        discountStartDate: '2026-08-16',
        discountEndDate: '2026-08-22',
        viewCount: 162,
        createdAt: '2026-08-15T10:00:00',
      },
    ],
    hasNext: true,
    nextCursor: 101,
  },
} as const;

describe('getProductList', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('gets a daily product list with the default category sort', async () => {
    mockedGet.mockResolvedValue(productListResponse);

    await expect(getProductList({ marketId: 1, type: 'DAILY' })).resolves.toEqual(
      productListResponse,
    );
    expect(mockedGet).toHaveBeenCalledWith(
      API_ENDPOINTS.owner.products.collection(1, {
        sort: 'CATEGORY',
        type: 'DAILY',
      }),
    );
  });

  it('passes the deal type and selected sort to the shared endpoint', async () => {
    mockedGet.mockResolvedValue(productListResponse);

    await getProductList({ marketId: 2, sort: 'VIEW_COUNT', type: 'PERIODIC' });

    expect(mockedGet).toHaveBeenCalledWith(
      API_ENDPOINTS.owner.products.collection(2, {
        sort: 'VIEW_COUNT',
        type: 'PERIODIC',
      }),
    );
  });

  it('rejects a response that does not match the OpenAPI success contract', async () => {
    mockedGet.mockResolvedValue({
      ...productListResponse,
      data: {
        products: productListResponse.data.content,
        hasNext: true,
        nextCursor: 101,
      },
    });

    await expect(getProductList({ marketId: 1, type: 'DAILY' })).rejects.toSatisfy(
      isApiResponseValidationError,
    );
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'FORBIDDEN_MARKET_ACCESS',
      message: '해당 마트에 대한 접근 권한이 없습니다.',
      status: 403,
      type: 'auth',
    });

    mockedGet.mockRejectedValue(apiError);

    await expect(getProductList({ marketId: 1, type: 'PERIODIC' })).rejects.toBe(apiError);
  });
});
