import { describe, expect, it } from 'vitest';

import { createMarketInformationRegistrationRequest } from './market-information-form.utils';

describe('createMarketInformationRegistrationRequest', () => {
  it('maps grouped opening hours and a weekly holiday to the API contract', () => {
    expect(
      createMarketInformationRegistrationRequest({
        additionalBusinessDay: '토요일',
        additionalBusinessTime: '10:00 - 14:00',
        address: '서울특별시 마포구 월드컵로 123',
        brn: '',
        businessDay: '월요일, 화요일',
        businessTime: '09:00 - 18:00',
        detailAddress: '',
        hasAdditionalBusinessHours: true,
        hasAdditionalMarketPhone: false,
        holiday: '일요일',
        latitude: 37.5665,
        longitude: 126.978,
        marketPhone1: '02-1234-5678',
        marketPhone2: null,
        marketPhonePrimary: 1,
        name: '동치미 마트',
        ownerPhone: '010-1234-5678',
        thumbnailUrl: null,
      }),
    ).toEqual({
      address: '서울특별시 마포구 월드컵로 123',
      brn: null,
      businessHours: [
        {
          close: '18:00',
          days: ['MONDAY', 'TUESDAY'],
          isOpen: true,
          open: '09:00',
        },
        {
          close: '14:00',
          days: ['SATURDAY'],
          isOpen: true,
          open: '10:00',
        },
        {
          close: null,
          days: ['SUNDAY'],
          isOpen: false,
          open: null,
        },
      ],
      detailAddress: null,
      latitude: 37.5665,
      longitude: 126.978,
      marketPhone1: '02-1234-5678',
      marketPhone2: null,
      marketPhonePrimary: 1,
      name: '동치미 마트',
      ownerPhone: '010-1234-5678',
      thumbnailUrl: null,
    });
  });
});
