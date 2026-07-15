import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { confirmPreparedProductDrafts } from './confirm-prepared-product-drafts';

vi.mock('@/shared/api', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(httpClient.post);

const confirmResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
} as const;

describe('confirmPreparedProductDrafts', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('confirms all prepared product drafts for the market without a request body', async () => {
    mockedPost.mockResolvedValue(confirmResponse);

    await expect(confirmPreparedProductDrafts(12)).resolves.toEqual(confirmResponse);
    expect(mockedPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.confirmDrafts(12));
  });

  it('rejects a response that does not match the success contract', async () => {
    mockedPost.mockResolvedValue({ ...confirmResponse, success: false });

    await expect(confirmPreparedProductDrafts(12)).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'DRAFT_NOT_COMPLETED',
      message: '등록 완료되지 않은 임시 상품이 있습니다.',
      status: 409,
      type: 'client',
    });

    mockedPost.mockRejectedValue(apiError);

    await expect(confirmPreparedProductDrafts(12)).rejects.toBe(apiError);
  });
});
