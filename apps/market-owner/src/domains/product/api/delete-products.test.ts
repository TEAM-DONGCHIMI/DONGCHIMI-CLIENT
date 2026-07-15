import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { deleteProduct, deleteProducts } from './delete-products';

vi.mock('@/shared/api', () => ({
  httpClient: {
    delete: vi.fn(),
  },
}));

const mockedDelete = vi.mocked(httpClient.delete);

describe('product deletion API', () => {
  beforeEach(() => {
    mockedDelete.mockReset();
  });

  it('deletes one product from the market endpoint', async () => {
    const response = {
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    };

    mockedDelete.mockResolvedValue(response);

    const request = { forceDelete: true };

    await expect(deleteProduct({ marketId: 12, productId: 34, request })).resolves.toEqual(
      response,
    );
    expect(mockedDelete).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.detail(12, 34), {
      json: request,
    });
  });

  it('deletes selected products with product ids in the request body', async () => {
    const request = { forceDelete: true, productIds: [1, 2, 3] };
    const response = {
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    };

    mockedDelete.mockResolvedValue(response);

    await expect(deleteProducts({ marketId: 12, request })).resolves.toEqual(response);
    expect(mockedDelete).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.collection(12), {
      json: request,
    });
  });

  it('rejects a response that does not match the success contract', async () => {
    mockedDelete.mockResolvedValue({
      success: false,
      code: 'PRODUCT_NOT_FOUND',
      message: '존재하지 않는 상품입니다.',
    });

    await expect(
      deleteProduct({ marketId: 12, productId: 34, request: { forceDelete: true } }),
    ).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'PRODUCT_NOT_FOUND',
      details: { data: { notFoundIds: [2, 5] } },
      message: '존재하지 않는 상품이 포함되어 있습니다.',
      status: 404,
      type: 'client',
    });

    mockedDelete.mockRejectedValue(apiError);

    await expect(
      deleteProducts({
        marketId: 12,
        request: { forceDelete: true, productIds: [1, 2, 5] },
      }),
    ).rejects.toBe(apiError);
  });
});
