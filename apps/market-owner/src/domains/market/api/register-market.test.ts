import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';

import { registerMarket, type RegisterMarketRequestTypes } from './register-market';

vi.mock('@/shared/api', () => ({
  httpClient: { post: vi.fn() },
}));

const mockedPost = vi.mocked(httpClient.post);
const request: RegisterMarketRequestTypes = {
  address: '서울특별시 마포구 월드컵로 123',
  brn: null,
  businessHours: [
    {
      close: '18:00',
      days: ['MONDAY', 'TUESDAY'],
      isOpen: true,
      open: '13:00',
    },
  ],
  detailAddress: '101호',
  latitude: 37.5665,
  longitude: 126.978,
  marketPhone1: '02-1234-5678',
  marketPhone2: null,
  marketPhonePrimary: 1,
  name: '동치미 마트',
  ownerPhone: '010-1234-5678',
  thumbnailUrl: null,
};

describe('registerMarket', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('posts the market registration request and returns the validated response', async () => {
    const response = {
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      success: true as const,
    };

    mockedPost.mockResolvedValue(response);

    await expect(registerMarket(request)).resolves.toEqual(response);
    expect(mockedPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.markets.root, { json: request });
  });

  it('does not swallow an error from the HTTP client', async () => {
    const error = new Error('request failed');

    mockedPost.mockRejectedValue(error);

    await expect(registerMarket(request)).rejects.toBe(error);
  });
});
