import { describe, expect, it } from 'vitest';

import { createMarketInformationForm } from './create-market-information-form';
import type { OwnerMarketDetailTypes } from './market-detail-schema';

const marketDetail = {
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
    {
      days: ['SATURDAY'],
      isOpen: true,
      open: '10:00',
      close: '18:00',
    },
    {
      days: ['THURSDAY', 'SUNDAY'],
      isOpen: false,
      open: null,
      close: null,
    },
  ],
  marketPhone1: '0212345678',
  marketPhone2: '01098765432',
  marketPhonePrimary: 2,
  ownerPhone: '01012345678',
  brn: '1234567890',
} satisfies OwnerMarketDetailTypes;

describe('createMarketInformationForm', () => {
  it('separates the base and detail address joined by the API delimiter', () => {
    const form = createMarketInformationForm({
      ...marketDetail,
      address: '서울 강남구 가로수길 9|배고파',
    });

    expect(form.address).toBe('서울 강남구 가로수길 9');
    expect(form.detailAddress).toBe('배고파');
  });

  it('마켓 상세 응답을 수정 폼 초기값으로 변환한다', () => {
    expect(createMarketInformationForm(marketDetail)).toEqual({
      additionalBusinessDay: '토요일',
      additionalBusinessTime: '10:00 - 18:00',
      address: '서울특별시 동대문구 회기로 1',
      brn: '123-45-67890',
      businessDay: '월요일, 수요일, 금요일',
      businessTime: '11:00 - 20:00',
      detailAddress: '',
      hasAdditionalBusinessHours: true,
      hasAdditionalMarketPhone: true,
      holiday: '목요일, 일요일',
      latitude: 37.5895,
      longitude: 127.0576,
      marketPhone1: '02-1234-5678',
      marketPhone2: '010-9876-5432',
      marketPhonePrimary: 2,
      name: '동치미 마트',
      ownerPhone: '010-1234-5678',
      thumbnailUrl: 'https://cdn.example.com/markets/10.png',
    });
  });

  it('선택 정보가 없으면 폼의 빈 상태로 변환한다', () => {
    const form = createMarketInformationForm({
      ...marketDetail,
      brn: null,
      businessHours: [marketDetail.businessHours[0]],
      marketPhone2: null,
      marketPhonePrimary: 0,
      thumbnailUrl: null,
    });

    expect(form).toMatchObject({
      additionalBusinessDay: '',
      additionalBusinessTime: '',
      brn: '',
      hasAdditionalBusinessHours: false,
      hasAdditionalMarketPhone: false,
      holiday: '',
      marketPhone2: null,
      marketPhonePrimary: 1,
      thumbnailUrl: null,
    });
  });
});
