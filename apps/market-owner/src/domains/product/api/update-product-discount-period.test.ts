import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import {
  updateProductDiscountPeriod,
  type UpdateProductDiscountPeriodParams,
} from './update-product-discount-period';

vi.mock('@/shared/api', () => ({
  httpClient: {
    patch: vi.fn(),
  },
}));

const mockedPatch = vi.mocked(httpClient.patch);
const params: UpdateProductDiscountPeriodParams = {
  marketId: 1,
  request: {
    discountStartDate: '2026-06-30',
    discountEndDate: '2026-07-02',
    productIds: [1, 2, 3],
  },
};
const successResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
} as const;

describe('updateProductDiscountPeriod', () => {
  beforeEach(() => {
    mockedPatch.mockReset();
  });

  it('updates the discount period for the selected product ids', async () => {
    mockedPatch.mockResolvedValue(successResponse);

    await expect(updateProductDiscountPeriod(params)).resolves.toEqual(successResponse);
    expect(mockedPatch).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.discountPeriod(1), {
      json: params.request,
    });
  });

  it('rejects a response that does not match the success contract', async () => {
    mockedPatch.mockResolvedValue({ ...successResponse, success: false });

    await expect(updateProductDiscountPeriod(params)).rejects.toSatisfy(
      isApiResponseValidationError,
    );
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'INVALID_INPUT',
      message: '올바르지 않은 기간 형식입니다.',
      status: 400,
      type: 'validation',
    });
    mockedPatch.mockRejectedValue(apiError);

    await expect(updateProductDiscountPeriod(params)).rejects.toBe(apiError);
  });
});
