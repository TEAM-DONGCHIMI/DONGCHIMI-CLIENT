import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import {
  savePreparedProductDrafts,
  type SavePreparedProductDraftsRequestTypes,
} from './save-prepared-product-drafts';

vi.mock('@/shared/api', () => ({
  httpClient: {
    put: vi.fn(),
  },
}));

const mockedPut = vi.mocked(httpClient.put);

const saveRequest: SavePreparedProductDraftsRequestTypes = {
  preparedProducts: [
    {
      preparedProductId: 1,
      name: '삼겹살 500g',
      thumbnailUrl: 'https://static.dongchimi.kr/test.png',
      discountedPrice: 4000,
      category: 'MEAT_EGG',
      promotionalPhrase: '맛이 미쳤어요',
      discountStartDate: '2026-07-15',
      discountEndDate: '2026-07-21',
      dealType: 'PERIODIC',
    },
  ],
};

const saveResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
} as const;

describe('savePreparedProductDrafts', () => {
  beforeEach(() => {
    mockedPut.mockReset();
  });

  it('saves prepared product drafts', async () => {
    mockedPut.mockResolvedValue(saveResponse);

    await expect(
      savePreparedProductDrafts({ marketId: 12, request: saveRequest }),
    ).resolves.toEqual(saveResponse);
    expect(mockedPut).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.draft(12), {
      json: saveRequest,
    });
  });

  it('rejects a response that does not match the success contract', async () => {
    mockedPut.mockResolvedValue({ ...saveResponse, success: false });

    await expect(
      savePreparedProductDrafts({ marketId: 12, request: saveRequest }),
    ).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'UNAUTHORIZED',
      message: '인증이 필요합니다.',
      status: 401,
      type: 'auth',
    });

    mockedPut.mockRejectedValue(apiError);

    await expect(savePreparedProductDrafts({ marketId: 12, request: saveRequest })).rejects.toBe(
      apiError,
    );
  });
});
