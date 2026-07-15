import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { updateProduct, type UpdateProductParams } from './update-product';

vi.mock('@/shared/api', () => ({
  httpClient: {
    put: vi.fn(),
  },
}));

const mockedPut = vi.mocked(httpClient.put);
const successResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
} as const;

describe('updateProduct', () => {
  beforeEach(() => {
    mockedPut.mockReset();
  });

  it('updates a daily product with the original price', async () => {
    const params: UpdateProductParams = {
      marketId: 1,
      productId: 101,
      request: {
        type: 'DAILY',
        thumbnailUrl: 'https://cdn.dongchimi.kr/products/101.png',
        name: '삼겹살 500g',
        category: 'MEAT_EGG',
        promotionalPhrase: '오늘 입고된 신선한 삼겹살',
        originalPrice: 22000,
        discountedPrice: 19500,
        discountStartDate: '2026-06-30',
        discountEndDate: '2026-06-30',
      },
    };
    mockedPut.mockResolvedValue(successResponse);

    await expect(updateProduct(params)).resolves.toEqual(successResponse);
    expect(mockedPut).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.detail(1, 101), {
      json: params.request,
    });
  });

  it('updates a periodic product without the original price', async () => {
    const params: UpdateProductParams = {
      marketId: 1,
      productId: 305,
      request: {
        type: 'PERIODIC',
        thumbnailUrl: null,
        name: '고등어 2마리',
        category: 'SEAFOOD',
        promotionalPhrase: null,
        discountedPrice: 6900,
        discountStartDate: '2026-06-30',
        discountEndDate: '2026-07-02',
      },
    };
    mockedPut.mockResolvedValue(successResponse);

    await expect(updateProduct(params)).resolves.toEqual(successResponse);
    expect(mockedPut).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.detail(1, 305), {
      json: params.request,
    });
  });

  it('rejects a response that does not match the success contract', async () => {
    mockedPut.mockResolvedValue({ ...successResponse, success: false });

    await expect(
      updateProduct({
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
      }),
    ).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'TYPE_MISMATCH',
      message: '상품의 판매 유형과 일치하지 않습니다.',
      status: 400,
      type: 'validation',
    });
    mockedPut.mockRejectedValue(apiError);

    await expect(
      updateProduct({
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
      }),
    ).rejects.toBe(apiError);
  });
});
