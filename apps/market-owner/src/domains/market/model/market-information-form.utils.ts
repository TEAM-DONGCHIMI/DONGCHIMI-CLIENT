import {
  type MarketInformationFormTypes,
  type MarketInformationRegistrationRequestTypes,
} from './market-information-form.types';

const businessRegistrationNumberDigitPattern = /\D/g;
const businessTimeDigitPattern = /\D/g;
const phoneDigitPattern = /\D/g;
const regionalPhonePattern = /^0(?:31|32|33|41|42|43|44|51|52|53|54|55|61|62|63|64)-\d{3}-\d{4}$/;
const businessDayToApiDayMap: Record<string, string> = {
  월요일: 'MONDAY',
  화요일: 'TUESDAY',
  수요일: 'WEDNESDAY',
  목요일: 'THURSDAY',
  금요일: 'FRIDAY',
  토요일: 'SATURDAY',
  일요일: 'SUNDAY',
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
  if (marketPhone.length === 0) {
    return true;
  }

  return (
    /^02-\d{3,4}-\d{4}$/.test(marketPhone) ||
    regionalPhonePattern.test(marketPhone) ||
    /^010-\d{4}-\d{4}$/.test(marketPhone) ||
    /^070-\d{4}-\d{4}$/.test(marketPhone)
  );
};

const parseBusinessTime = (businessTime: string) => {
  const [open, close] = businessTime.split(' - ');

  return { close, open };
};

const createBusinessHourSlot = ({
  businessDay,
  businessTime,
}: {
  businessDay: string;
  businessTime: string;
}) => {
  if (businessDay.length === 0 || businessTime.length === 0) {
    return null;
  }

  const days = businessDay
    .split(', ')
    .map((dayLabel) => businessDayToApiDayMap[dayLabel])
    .filter((day): day is string => day !== undefined);
  const { close, open } = parseBusinessTime(businessTime);

  return { close, days, isOpen: true, open };
};

const createClosedBusinessHourSlot = (holiday: string) => {
  const days = holiday
    .split(', ')
    .map((dayLabel) => businessDayToApiDayMap[dayLabel])
    .filter((day): day is string => day !== undefined);

  return days.length > 0 ? { close: null, days, isOpen: false, open: null } : null;
};

export const createMarketInformationRegistrationRequest = (
  form: MarketInformationFormTypes,
): MarketInformationRegistrationRequestTypes => {
  const isHolidayClosed = form.holiday.split(', ').includes('공휴일');
  const businessHours = [
    createBusinessHourSlot({
      businessDay: form.businessDay,
      businessTime: form.businessTime,
    }),
    createBusinessHourSlot({
      businessDay: form.additionalBusinessDay,
      businessTime: form.additionalBusinessTime,
    }),
    createClosedBusinessHourSlot(form.holiday),
  ].filter((slot): slot is NonNullable<typeof slot> => slot !== null);

  return {
    address: form.address,
    brn: form.brn || null,
    businessHours,
    detailAddress: form.detailAddress || null,
    isHolidayClosed,
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
