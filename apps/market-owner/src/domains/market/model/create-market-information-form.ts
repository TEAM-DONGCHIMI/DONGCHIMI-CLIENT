import type { MarketInformationFormTypes } from './market-information-form.types';
import type { OwnerMarketDetailTypes } from './market-detail-schema';
import {
  formatBusinessRegistrationNumber,
  formatMarketPhoneNumber,
  formatMobilePhoneNumber,
} from './market-information-form.utils';

const apiDayToBusinessDayMap: Record<string, string> = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
};

const toBusinessDay = (days: string[]) => {
  return days
    .map((day) => apiDayToBusinessDayMap[day])
    .filter((day): day is string => day !== undefined)
    .join(', ');
};

const toBusinessTime = (open?: string | null, close?: string | null) => {
  return open && close ? `${open} - ${close}` : '';
};

const splitAddress = (address: string) => {
  const separatorIndex = address.indexOf('|');

  if (separatorIndex === -1) {
    return { address, detailAddress: '' };
  }

  return {
    address: address.slice(0, separatorIndex).trim(),
    detailAddress: address.slice(separatorIndex + 1).trim(),
  };
};

export const createMarketInformationForm = (
  market: OwnerMarketDetailTypes,
): MarketInformationFormTypes => {
  const openBusinessHours = market.businessHours.filter(
    (businessHour) => businessHour.isOpen && businessHour.open && businessHour.close,
  );
  const [primaryBusinessHours, additionalBusinessHours] = openBusinessHours;
  const closedBusinessHours = market.businessHours.find((businessHour) => !businessHour.isOpen);
  const marketPhone2 = market.marketPhone2 ? formatMarketPhoneNumber(market.marketPhone2) : null;
  const address = splitAddress(market.address);

  return {
    additionalBusinessDay: additionalBusinessHours
      ? toBusinessDay(additionalBusinessHours.days)
      : '',
    additionalBusinessTime: additionalBusinessHours
      ? toBusinessTime(additionalBusinessHours.open, additionalBusinessHours.close)
      : '',
    address: address.address,
    brn: formatBusinessRegistrationNumber(market.brn ?? ''),
    businessDay: primaryBusinessHours ? toBusinessDay(primaryBusinessHours.days) : '',
    businessTime: primaryBusinessHours
      ? toBusinessTime(primaryBusinessHours.open, primaryBusinessHours.close)
      : '',
    detailAddress: address.detailAddress,
    hasAdditionalBusinessHours: additionalBusinessHours !== undefined,
    hasAdditionalMarketPhone: marketPhone2 !== null,
    holiday: closedBusinessHours
      ? (apiDayToBusinessDayMap[closedBusinessHours.days[0] ?? ''] ?? '')
      : '',
    latitude: market.latitude,
    longitude: market.longitude,
    marketPhone1: formatMarketPhoneNumber(market.marketPhone1),
    marketPhone2,
    marketPhonePrimary: market.marketPhonePrimary === 2 ? 2 : 1,
    name: market.name,
    ownerPhone: formatMobilePhoneNumber(market.ownerPhone),
    thumbnailUrl: market.thumbnailUrl ?? null,
  };
};
