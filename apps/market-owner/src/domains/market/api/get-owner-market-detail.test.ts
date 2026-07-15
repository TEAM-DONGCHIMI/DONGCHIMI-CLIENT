import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { getOwnerMarketDetail } from './get-owner-market-detail';

vi.mock('@/shared/api', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(httpClient.get);

const ownerMarketDetailResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    marketId: 10,
    name: '동치미 마트',
    thumbnailUrl: 'https://cdn.example.com/markets/10.png',
    address: '서울특별시 동대문구 회기로 1',
    latitude: 37.5895,
    longitude: 127.0576,
    businessHours: [
      {
        days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
        isOpen: true,
        open: '11:00',
        close: '20:00',
      },
    ],
    marketPhone1: '0212345678',
    marketPhone2: null,
    marketPhonePrimary: 1,
    ownerPhone: '01012345678',
    brn: '1234567890',
  },
} as const;

describe('getOwnerMarketDetail', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('marketId로 점주 마켓 상세 정보를 조회한다', async () => {
    mockedGet.mockResolvedValue(ownerMarketDetailResponse);

    await expect(getOwnerMarketDetail(10)).resolves.toEqual(ownerMarketDetailResponse.data);
    expect(mockedGet).toHaveBeenCalledWith(API_ENDPOINTS.owner.markets.detail(10));
  });

  it('성공 계약과 다른 응답을 거부한다', async () => {
    mockedGet.mockResolvedValue({
      ...ownerMarketDetailResponse,
      data: {
        ...ownerMarketDetailResponse.data,
        marketId: '10',
      },
    });

    await expect(getOwnerMarketDetail(10)).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('HTTP client 오류를 삼키지 않는다', async () => {
    const apiError = new ApiError({
      code: 'MARKET_NOT_FOUND',
      message: '마트를 찾을 수 없습니다.',
      status: 404,
      type: 'client',
    });
    mockedGet.mockRejectedValue(apiError);

    await expect(getOwnerMarketDetail(10)).rejects.toBe(apiError);
  });
});
