import type { MarketInformationFormTypes } from '@/domains/market/model';

export const marketInformationManagementFixture = {
  initialForm: {
    additionalBusinessDay: '화, 목, 토',
    additionalBusinessTime: '10:00 - 20:00',
    address: '회기에요',
    brn: '',
    businessDay: '월, 수, 금',
    businessTime: '11:00 - 20:00',
    detailAddress: '4층으로오세요',
    hasAdditionalBusinessHours: true,
    hasAdditionalMarketPhone: true,
    holiday: '',
    latitude: 37.5895,
    longitude: 127.0576,
    marketPhone1: '010-0000-0000',
    marketPhone2: '010-0000-0000',
    marketPhonePrimary: 1,
    name: '상헌 마트',
    ownerPhone: '010-0000-0000',
    thumbnailUrl: null,
  } satisfies MarketInformationFormTypes,
} as const;
