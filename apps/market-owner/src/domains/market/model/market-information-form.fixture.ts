import type { MarketInformationFormTypes } from './market-information-form.types';

export const emptyMarketInformationForm = {
  name: '',
  thumbnailUrl: null,
  address: '',
  detailAddress: '',
  latitude: 0,
  longitude: 0,
  businessDay: '',
  businessTime: '',
  additionalBusinessDay: '',
  additionalBusinessTime: '',
  hasAdditionalBusinessHours: false,
  hasAdditionalMarketPhone: false,
  holiday: '',
  marketPhone1: '',
  marketPhone2: null,
  marketPhonePrimary: 1,
  ownerPhone: '',
  brn: '',
} satisfies MarketInformationFormTypes;
