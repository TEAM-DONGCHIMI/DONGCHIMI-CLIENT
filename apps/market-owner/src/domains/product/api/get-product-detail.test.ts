import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { getProductDetail } from './get-product-detail';

vi.mock('@/shared/api', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(httpClient.get);

const productDetailResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    productId: 101,
    name: '삼겹살 500g',
    dealType: 'PERIODIC',
    thumbnailUrl: 'https://cdn.example.com/products/101.png',
    originalPrice: 15000,
    discountedPrice: 12000,
    category: 'MEAT_EGG',
    categoryName: '정육/달걀',
    promotionalPhrase: '오늘만 특가!',
    discountStartDate: '2025-08-01',
    discountEndDate: '2025-08-16',
  },
} as const;

describe('getProductDetail', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('gets an owner product detail by market and product id', async () => {
    mockedGet.mockResolvedValue(productDetailResponse);

    await expect(getProductDetail({ marketId: 1, productId: 101 })).resolves.toEqual(
      productDetailResponse,
    );
    expect(mockedGet).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.detail(1, 101));
  });

  it('accepts nullable optional product fields', async () => {
    const responseWithoutOptionalValues = {
      ...productDetailResponse,
      data: {
        ...productDetailResponse.data,
        thumbnailUrl: null,
        promotionalPhrase: null,
      },
    };
    mockedGet.mockResolvedValue(responseWithoutOptionalValues);

    await expect(getProductDetail({ marketId: 1, productId: 101 })).resolves.toEqual(
      responseWithoutOptionalValues,
    );
  });

  it('rejects a response that does not match the OpenAPI success contract', async () => {
    mockedGet.mockResolvedValue({
      ...productDetailResponse,
      data: {
        ...productDetailResponse.data,
        dealType: 'INVALID',
      },
    });

    await expect(getProductDetail({ marketId: 1, productId: 101 })).rejects.toSatisfy(
      isApiResponseValidationError,
    );
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'PRODUCT_NOT_FOUND',
      message: '존재하지 않는 상품입니다.',
      status: 404,
      type: 'client',
    });
    mockedGet.mockRejectedValue(apiError);

    await expect(getProductDetail({ marketId: 1, productId: 101 })).rejects.toBe(apiError);
  });
});
