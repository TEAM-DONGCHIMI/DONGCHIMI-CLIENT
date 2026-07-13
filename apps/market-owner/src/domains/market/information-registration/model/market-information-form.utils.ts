import {
  type BusinessHourDayTypes,
  type BusinessHoursTypes,
  type MarketInformationFormTypes,
  type MarketInformationRegistrationRequest,
} from './market-information-form.types';

const businessRegistrationNumberDigitPattern = /\D/g;
const businessTimeDigitPattern = /\D/g;
const phoneDigitPattern = /\D/g;
const businessHourDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const businessDayToApiDayMap: Record<string, BusinessHourDayTypes> = {
  월요일: 'mon',
  화요일: 'tue',
  수요일: 'wed',
  목요일: 'thu',
  금요일: 'fri',
  토요일: 'sat',
  일요일: 'sun',
};

export const formatBusinessRegistrationNumber = (value: string) => {
  const digits = value.replace(businessRegistrationNumberDigitPattern, '').slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 5) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

export const formatBusinessTime = (value: string) => {
  const digits = value.replace(businessTimeDigitPattern, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)} - ${digits.slice(4)}`;
  }

  return `${digits.slice(0, 2)}:${digits.slice(2, 4)} - ${digits.slice(4, 6)}:${digits.slice(6)}`;
};

export const formatMobilePhoneNumber = (value: string) => {
  const digits = value.replace(phoneDigitPattern, '').slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export const formatMarketPhoneNumber = (value: string) => {
  const digits = value.replace(phoneDigitPattern, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.startsWith('02')) {
    if (digits.length <= 5) {
      return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }

    if (digits.length <= 9) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    }

    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length <= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export const isValidBusinessRegistrationNumber = (businessRegistrationNumber: string) => {
  const digits = businessRegistrationNumber.replace(businessRegistrationNumberDigitPattern, '');

  return digits.length === 0 || digits.length === 10;
};

export const isValidBusinessDay = (businessDay: string) => {
  const businessDays = businessDay.trim().length > 0 ? businessDay.split(', ') : [];

  return businessDays.length > 0;
};

export const isValidBusinessTime = (businessTime: string) => {
  const digits = businessTime.replace(businessTimeDigitPattern, '');

  if (digits.length !== 8) {
    return false;
  }

  const startHour = Number(digits.slice(0, 2));
  const startMinute = Number(digits.slice(2, 4));
  const endHour = Number(digits.slice(4, 6));
  const endMinute = Number(digits.slice(6, 8));
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  return (
    startHour <= 23 &&
    endHour <= 23 &&
    startMinute <= 59 &&
    endMinute <= 59 &&
    startTotalMinutes < endTotalMinutes
  );
};

export const isValidOwnerPhone = (ownerPhone: string) => {
  const digits = ownerPhone.replace(phoneDigitPattern, '');

  if (digits.length === 0) {
    return true;
  }

  return /^01[016789]\d{7,8}$/.test(digits);
};

export const isValidMarketPhone = (marketPhone: string) => {
  const digits = marketPhone.replace(phoneDigitPattern, '');

  if (digits.length === 0) {
    return true;
  }

  return (
    /^02\d{7,8}$/.test(digits) ||
    /^0[3-6][1-5]\d{7}$/.test(digits) ||
    /^01[016789]\d{7,8}$/.test(digits) ||
    /^070\d{8}$/.test(digits)
  );
};

const createEmptyBusinessHours = (): BusinessHoursTypes => {
  return businessHourDays.reduce(
    (businessHours, day) => ({
      ...businessHours,
      [day]: null,
    }),
    {} as BusinessHoursTypes,
  );
};

const parseBusinessTime = (businessTime: string) => {
  const [open, close] = businessTime.split(' - ');

  return { close, open };
};

const applyBusinessHours = ({
  businessDay,
  businessHours,
  businessTime,
}: {
  businessDay: string;
  businessHours: BusinessHoursTypes;
  businessTime: string;
}) => {
  if (businessDay.length === 0 || businessTime.length === 0) {
    return;
  }

  const businessTimeValue = parseBusinessTime(businessTime);

  businessDay.split(', ').forEach((dayLabel) => {
    const day = businessDayToApiDayMap[dayLabel];

    if (day) {
      businessHours[day] = businessTimeValue;
    }
  });
};

export const createMarketInformationRegistrationRequest = (
  form: MarketInformationFormTypes,
): MarketInformationRegistrationRequest => {
  const businessHours = createEmptyBusinessHours();

  applyBusinessHours({
    businessDay: form.businessDay,
    businessHours,
    businessTime: form.businessTime,
  });
  applyBusinessHours({
    businessDay: form.additionalBusinessDay,
    businessHours,
    businessTime: form.additionalBusinessTime,
  });

  return {
    address: form.address,
    brn: form.brn || null,
    businessHours,
    detailAddress: form.detailAddress || null,
    latitude: form.latitude,
    longitude: form.longitude,
    marketPhone1: form.marketPhone1,
    marketPhone2: form.marketPhone2,
    marketPhonePrimary: form.marketPhonePrimary,
    name: form.name,
    ownerPhone: form.ownerPhone,
    thumbnailUrl: form.thumbnailUrl,
  };
};
