import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';

import { updateOwnerMarket, type UpdateOwnerMarketRequestTypes } from './update-owner-market';

vi.mock('@/shared/api', () => ({ httpClient: { put: vi.fn() } }));

const mockedPut = vi.mocked(httpClient.put);
const request = {
  name: '동치미 마트 강남점',
  thumbnailUrl: null,
  address: '서울 강남구 가로수길 9',
  detailAddress: '1층',
  latitude: 37.5,
  longitude: 127.0,
  businessHours: [{ days: ['MONDAY'], isOpen: true, open: '13:00', close: '18:00' }],
  isHolidayClosed: false,
  marketPhone1: '02-1234-5678',
  marketPhone2: null,
  marketPhonePrimary: 1,
  ownerPhone: '010-1234-5678',
  brn: null,
} satisfies UpdateOwnerMarketRequestTypes;

describe('updateOwnerMarket', () => {
  beforeEach(() => mockedPut.mockReset());

  it('updates the selected owner market', async () => {
    const response = { success: true as const, code: 'SUCCESS', message: '수정되었습니다.' };
    mockedPut.mockResolvedValue(response);

    await expect(updateOwnerMarket({ marketId: 10, request })).resolves.toEqual(response);
    expect(mockedPut).toHaveBeenCalledWith(API_ENDPOINTS.owner.markets.detail(10), {
      json: request,
    });
  });

  it('rejects an invalid success response', async () => {
    mockedPut.mockResolvedValue({ success: true, code: 'SUCCESS' });

    await expect(updateOwnerMarket({ marketId: 10, request })).rejects.toSatisfy(
      isApiResponseValidationError,
    );
  });
});
