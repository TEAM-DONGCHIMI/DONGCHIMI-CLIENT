import type { BusinessDayTypes, BusinessHourTypes } from '../fixtures/market-products.fixture';

type OpenBusinessHourTypes = Extract<BusinessHourTypes, { isOpen: true }>;

type CallModalDescriptionParamsTypes = Readonly<{
  closeTime: string | undefined;
  isOpenNow: boolean;
}>;

const BUSINESS_DAY_BY_DATE_DAY_INDEX = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] satisfies BusinessDayTypes[];

export const getCurrentBusinessCloseTime = (
  businessHours: readonly BusinessHourTypes[],
  date = new Date(),
) => {
  const currentBusinessDay = BUSINESS_DAY_BY_DATE_DAY_INDEX[date.getDay()];

  if (currentBusinessDay == null) {
    return undefined;
  }

  const currentBusinessHour = businessHours.find(
    (businessHour): businessHour is OpenBusinessHourTypes => {
      return businessHour.isOpen && businessHour.days.includes(currentBusinessDay);
    },
  );

  return currentBusinessHour?.close;
};

export const getCallModalDescription = ({
  closeTime,
  isOpenNow,
}: CallModalDescriptionParamsTypes) => {
  if (!isOpenNow) {
    return '현재 영업 시간이 아니에요.';
  }

  if (closeTime == null) {
    return '현재 영업중';
  }

  return `현재 영업중· ${closeTime}까지`;
};

export const getTelHref = (phoneNumber: string) => `tel:${phoneNumber.replaceAll('-', '')}`;

export const getShareUrl = (slug: string) => `dongchimi.kr/${slug}`;
