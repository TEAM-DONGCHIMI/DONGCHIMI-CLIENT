import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import {
  registerDailyProduct,
  type RegisterDailyProductRequestTypes,
} from './register-daily-product';

vi.mock('@/shared/api', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(httpClient.post);

const registeredProductResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    productId: 101,
    name: '토마토',
    dealType: 'DAILY',
    thumbnailUrl: 'https://cdn.example.com/products/101.png',
    originalPrice: 5000,
    discountedPrice: 4500,
    category: 'VEGETABLE_FRUIT',
    categoryName: '채소/과일',
    promotionalPhrase: '멋쟁이 토마토',
    discountStartDate: '2026-06-30',
    discountEndDate: '2026-06-30',
  },
} as const;

describe('registerDailyProduct', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('posts the daily product request to the market endpoint', async () => {
    const request: RegisterDailyProductRequestTypes = {
      thumbnailUrl: 'https://static.example.com/tmp/PRODUCT_THUMBNAIL/product.png',
      name: '토마토',
      category: 'VEGETABLE_FRUIT',
      promotionalPhrase: '멋쟁이 토마토',
      originalPrice: 5000,
      discountedPrice: 4500,
      discountStartDate: '2026-06-30',
      discountEndDate: '2026-06-30',
    };
    const response = registeredProductResponse;

    mockedPost.mockResolvedValue(response);

    await expect(registerDailyProduct({ marketId: 12, request })).resolves.toEqual(response);
    expect(mockedPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.daily(12), {
      json: request,
    });
  });

  it('rejects a response that does not match the success contract', async () => {
    mockedPost.mockResolvedValue({
      success: false,
      code: 'MARKET_NOT_FOUND',
      message: '존재하지 않는 마트입니다.',
    });

    await expect(
      registerDailyProduct({
        marketId: 12,
        request: {
          name: '토마토',
          category: 'VEGETABLE_FRUIT',
          originalPrice: 5000,
          discountedPrice: 4500,
          discountStartDate: '2026-06-30',
          discountEndDate: '2026-06-30',
        },
      }),
    ).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('rejects a success response without the registered product id', async () => {
    mockedPost.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });

    await expect(
      registerDailyProduct({
        marketId: 12,
        request: {
          name: '토마토',
          category: 'VEGETABLE_FRUIT',
          originalPrice: 5000,
          discountedPrice: 4500,
          discountStartDate: '2026-06-30',
          discountEndDate: '2026-06-30',
        },
      }),
    ).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('rejects a success response without the registered product detail fields', async () => {
    mockedPost.mockResolvedValue({
      ...registeredProductResponse,
      data: {
        productId: 101,
      },
    });

    await expect(
      registerDailyProduct({
        marketId: 12,
        request: {
          name: '토마토',
          category: 'VEGETABLE_FRUIT',
          originalPrice: 5000,
          discountedPrice: 4500,
          discountStartDate: '2026-06-30',
          discountEndDate: '2026-06-30',
        },
      }),
    ).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'FORBIDDEN_MARKET_ACCESS',
      message: '해당 마트에 대한 접근 권한이 없습니다.',
      status: 403,
      type: 'auth',
    });

    mockedPost.mockRejectedValue(apiError);

    await expect(
      registerDailyProduct({
        marketId: 2,
        request: {
          name: '토마토',
          category: 'VEGETABLE_FRUIT',
          originalPrice: 5000,
          discountedPrice: 4500,
          discountStartDate: '2026-06-30',
          discountEndDate: '2026-06-30',
        },
      }),
    ).rejects.toBe(apiError);
  });
});
