import { describe, expect, it } from 'vitest';

import {
  createMarketInformationRegistrationRequest,
  isValidMarketPhone,
} from './market-information-form.utils';

describe('isValidMarketPhone', () => {
  it.each(['010-1234-5678', '02-123-4567', '02-1234-5678', '031-123-4567', '070-1234-5678'])(
    'accepts a supported phone number: %s',
    (phoneNumber) => {
      expect(isValidMarketPhone(phoneNumber)).toBe(true);
    },
  );

  it.each([
    '034-123-4567',
    '0311234567',
    '031-1234567',
    '031-0430-2432',
    '031-12-5678',
    '070-123-4567',
    '010-123-4567',
  ])('rejects an unsupported phone number: %s', (phoneNumber) => {
    expect(isValidMarketPhone(phoneNumber)).toBe(false);
  });
});

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
        holiday: '토요일, 일요일',
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
          days: ['SATURDAY', 'SUNDAY'],
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
