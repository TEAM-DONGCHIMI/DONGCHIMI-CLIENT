import { emptyMarketInformationForm } from '@/domains/market/model';

export const marketInformationRegistrationFixture = {
  selectedAddress: '서울특별시 마포구 월드컵로 123',
  initialForm: emptyMarketInformationForm,
  requiredFieldNames: [
    'name',
    'address',
    'detailAddress',
    'businessDay',
    'businessTime',
    'marketPhone1',
    'ownerPhone',
  ],
} as const;
