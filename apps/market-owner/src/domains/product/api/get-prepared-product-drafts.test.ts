import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import {
  getAllPreparedProductDrafts,
  getPreparedProductDrafts,
} from './get-prepared-product-drafts';

vi.mock('@/shared/api', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(httpClient.get);

const preparedProductDraftsResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    totalCount: 128,
    successCount: 112,
    failCount: 12,
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
        draftStatus: 'SUCCESS',
        failReason: null,
      },
      {
        preparedProductId: 2,
        name: '고등어',
        thumbnailUrl: null,
        discountedPrice: 4000,
        category: null,
        promotionalPhrase: '맛이 미쳤어요',
        discountStartDate: '2026-07-15',
        discountEndDate: '2026-07-21',
        draftStatus: 'FAIL',
        failReason: '카테고리 미선택',
      },
    ],
  },
} as const;

describe('getPreparedProductDrafts', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('gets prepared product drafts with search, category filters, and pagination', async () => {
    mockedGet.mockResolvedValue(preparedProductDraftsResponse);

    await expect(
      getPreparedProductDrafts({
        categories: ['MEAT_EGG', 'SEAFOOD'],
        marketId: 12,
        page: 1,
        search: '고등어',
        size: 20,
      }),
    ).resolves.toEqual(preparedProductDraftsResponse);
    expect(mockedGet).toHaveBeenCalledWith(
      API_ENDPOINTS.owner.products.draft(12, {
        categories: ['MEAT_EGG', 'SEAFOOD'],
        page: 1,
        search: '고등어',
        size: 20,
      }),
    );
  });

  it('uses the default page and size when optional params are omitted', async () => {
    mockedGet.mockResolvedValue(preparedProductDraftsResponse);

    await getPreparedProductDrafts({ marketId: 12 });

    expect(mockedGet).toHaveBeenCalledWith(
      API_ENDPOINTS.owner.products.draft(12, {
        categories: undefined,
        page: 0,
        search: undefined,
        size: 10,
      }),
    );
  });

  it('rejects a response that does not match the success contract', async () => {
    mockedGet.mockResolvedValue({
      ...preparedProductDraftsResponse,
      data: {
        ...preparedProductDraftsResponse.data,
        totalCount: '128',
      },
    });

    await expect(getPreparedProductDrafts({ marketId: 12 })).rejects.toSatisfy(
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

    await expect(getPreparedProductDrafts({ marketId: 12 })).rejects.toBe(apiError);
  });

  it('gets every prepared product draft page with the server-supported max page size', async () => {
    mockedGet
      .mockResolvedValueOnce({
        ...preparedProductDraftsResponse,
        data: {
          ...preparedProductDraftsResponse.data,
          totalCount: 102,
          preparedProducts: Array.from({ length: 100 }, (_, index) => ({
            ...preparedProductDraftsResponse.data.preparedProducts[0],
            preparedProductId: index + 1,
          })),
        },
      })
      .mockResolvedValueOnce({
        ...preparedProductDraftsResponse,
        data: {
          ...preparedProductDraftsResponse.data,
          totalCount: 102,
          preparedProducts: [
            {
              ...preparedProductDraftsResponse.data.preparedProducts[0],
              preparedProductId: 101,
            },
            {
              ...preparedProductDraftsResponse.data.preparedProducts[0],
              preparedProductId: 102,
            },
          ],
        },
      });

    const response = await getAllPreparedProductDrafts({
      marketId: 12,
      search: '고등어',
      size: 1_000,
    });

    expect(response.data.preparedProducts).toHaveLength(102);
    expect(mockedGet).toHaveBeenNthCalledWith(
      1,
      API_ENDPOINTS.owner.products.draft(12, {
        categories: undefined,
        page: 0,
        search: '고등어',
        size: 100,
      }),
    );
    expect(mockedGet).toHaveBeenNthCalledWith(
      2,
      API_ENDPOINTS.owner.products.draft(12, {
        categories: undefined,
        page: 1,
        search: '고등어',
        size: 100,
      }),
    );
  });
});
