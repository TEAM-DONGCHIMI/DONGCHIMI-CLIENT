import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, httpClient } from '@/shared/api';
import type * as SharedApiModule from '@/shared/api';

import { getPeriodicPreview } from './get-periodic-preview';

vi.mock('@/shared/api', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof SharedApiModule;

  return {
    ...actual,
    httpClient: {
      get: vi.fn(),
    },
  };
});

const mockedHttpClientGet = vi.mocked(httpClient.get);

const periodicPreviewResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청이 성공했습니다.',
  data: {
    marketId: 12,
    name: '망원 신선마트',
    thumbnailUrl: 'https://cdn.example.com/market.png',
    address: '서울 마포구 망원동',
    isOpenNow: true,
    businessHours: [{ days: ['MONDAY', 'TUESDAY'], isOpen: true, open: '10:00', close: '20:00' }],
    isHolidayClosed: false,
    marketPhone1: '02-123-4567',
    marketPhone2: null,
    ownerPhone: '010-0000-0000',
    top3: [
      {
        productId: 101,
        name: '사과 500g',
        thumbnailUrl: 'https://cdn.example.com/apple.png',
        discountedPrice: 6900,
        discountRate: 10,
      },
    ],
    daily: {
      totalCount: 1,
      products: [
        {
          productId: 201,
          name: '콩나물 500g',
          thumbnailUrl: 'https://cdn.example.com/bean.png',
          originalPrice: 5000,
          discountedPrice: 4500,
          discountRate: 10,
        },
      ],
    },
    preparedProducts: [
      {
        preparedProductId: 301,
        name: '행사 상품',
        thumbnailUrl: 'https://cdn.example.com/periodic.png',
        discountedPrice: 3900,
      },
    ],
  },
};

describe('getPeriodicPreview', () => {
  beforeEach(() => {
    mockedHttpClientGet.mockReset();
  });

  it('gets a periodic leaflet preview for the market', async () => {
    mockedHttpClientGet.mockResolvedValueOnce(periodicPreviewResponse);

    await expect(getPeriodicPreview(12)).resolves.toEqual(periodicPreviewResponse.data);
    expect(mockedHttpClientGet).toHaveBeenCalledWith(
      API_ENDPOINTS.owner.flyers.periodicPreview(12),
    );
  });

  it('accepts a periodic preview response with empty daily products and prepared products', async () => {
    const actualResponseShape = {
      ...periodicPreviewResponse,
      data: {
        ...periodicPreviewResponse.data,
        marketId: 3,
        isHolidayClosed: true,
        isOpenNow: false,
        businessHours: [
          {
            days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            isOpen: true,
            open: '08:30',
            close: '22:30',
          },
        ],
        marketPhone2: '02-2337-1643',
        top3: [],
        daily: {
          totalCount: 0,
          products: [],
        },
        preparedProducts: [
          {
            preparedProductId: 2004,
            name: '스프링 코튼블라썸 2.1L',
            thumbnailUrl: 'https://static.dongchiimi.com/tmp/product.jpg',
            discountedPrice: 7980,
          },
          {
            preparedProductId: 2003,
            name: '2080 치약',
            thumbnailUrl: 'https://static.dongchiimi.com/tmp/toothpaste.jpg',
            discountedPrice: 4980,
          },
        ],
      },
    };

    mockedHttpClientGet.mockResolvedValueOnce(actualResponseShape);

    await expect(getPeriodicPreview(3)).resolves.toEqual(actualResponseShape.data);
  });

  it('rejects a success response without preview data', async () => {
    mockedHttpClientGet.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: '요청이 성공했습니다.',
      data: null,
    });

    await expect(getPeriodicPreview(12)).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error', async () => {
    const apiError = new ApiError({
      code: 'MARKET_ACCESS_DENIED',
      message: '해당 마트에 대한 권한이 없습니다.',
      status: 403,
      type: 'auth',
    });

    mockedHttpClientGet.mockRejectedValueOnce(apiError);

    await expect(getPeriodicPreview(12)).rejects.toBe(apiError);
  });
});
