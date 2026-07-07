export const marketInformationRegistrationFixture = {
  businessDays: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
  initialForm: {
    marketName: '',
    businessRegistrationNumber: '',
    address: '',
    addressDetail: '',
    businessDay: '',
    businessTime: '',
    holiday: '',
    marketPhone: '',
    ownerPhone: '',
  },
  requiredFieldNames: [
    'marketName',
    'address',
    'addressDetail',
    'businessDay',
    'businessTime',
    'marketPhone',
    'ownerPhone',
  ],
} as const;

export const holidayOptions = ['공휴일', ...marketInformationRegistrationFixture.businessDays];
