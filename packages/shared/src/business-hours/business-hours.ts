export type BusinessDayTypes =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type BusinessHourTypes =
  | {
      close: string;
      days: readonly BusinessDayTypes[];
      isOpen: true;
      open: string;
    }
  | {
      close?: null;
      days: readonly BusinessDayTypes[];
      isOpen: false;
      open?: null;
    };

export type BusinessHourInputTypes = {
  close?: string | null;
  days: readonly string[];
  isOpen: boolean;
  open?: string | null;
};

type OpenBusinessHourTypes = Extract<BusinessHourTypes, { isOpen: true }>;

export type BusinessHourTextTypes =
  | {
      dayText: string;
      isClosed: true;
    }
  | {
      dayText: string;
      isClosed: false;
      timeText: string;
    };

const DAY_LABELS: Record<BusinessDayTypes, string> = {
  FRIDAY: '금',
  MONDAY: '월',
  SATURDAY: '토',
  SUNDAY: '일',
  THURSDAY: '목',
  TUESDAY: '화',
  WEDNESDAY: '수',
};

const BUSINESS_DAY_ORDER = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] satisfies BusinessDayTypes[];

const BUSINESS_DAY_INDEX = new Map(
  BUSINESS_DAY_ORDER.map((businessDay, index) => [businessDay, index]),
);

const BUSINESS_DAY_BY_DATE_DAY_INDEX = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] satisfies BusinessDayTypes[];

const isBusinessDay = (day: string): day is BusinessDayTypes => {
  return BUSINESS_DAY_INDEX.has(day as BusinessDayTypes);
};

export const sortBusinessDays = (days: readonly string[]) => {
  return Array.from(new Set(days.filter(isBusinessDay))).sort((previousDay, nextDay) => {
    return (BUSINESS_DAY_INDEX.get(previousDay) ?? 0) - (BUSINESS_DAY_INDEX.get(nextDay) ?? 0);
  });
};

export const groupContinuousBusinessDays = (days: readonly string[]) => {
  const sortedDays = sortBusinessDays(days);

  return sortedDays.reduce<BusinessDayTypes[][]>((groups, day) => {
    const previousGroup = groups[groups.length - 1];
    const previousDay = previousGroup?.[previousGroup.length - 1];
    const previousDayIndex = previousDay == null ? undefined : BUSINESS_DAY_INDEX.get(previousDay);
    const currentDayIndex = BUSINESS_DAY_INDEX.get(day);
    const isContinuous =
      previousDayIndex != null &&
      currentDayIndex != null &&
      currentDayIndex === previousDayIndex + 1;

    if (previousGroup != null && isContinuous) {
      previousGroup.push(day);
      return groups;
    }

    return [...groups, [day]];
  }, []);
};

const formatBusinessDayGroup = (days: readonly BusinessDayTypes[]) => {
  const firstDay = days[0];
  const lastDay = days[days.length - 1];

  if (firstDay == null || lastDay == null) {
    return '';
  }

  if (days.length === 1) {
    return `${DAY_LABELS[firstDay]}요일`;
  }

  return `${DAY_LABELS[firstDay]}-${DAY_LABELS[lastDay]}`;
};

export const formatBusinessDays = (days: readonly string[]) => {
  if (days.length === 0) {
    return '';
  }

  return groupContinuousBusinessDays(days).map(formatBusinessDayGroup).join(', ');
};

export const formatBusinessHour = (businessHour: BusinessHourInputTypes): BusinessHourTextTypes => {
  const dayText = formatBusinessDays(businessHour.days);

  if (!businessHour.isOpen || businessHour.open == null || businessHour.close == null) {
    return {
      dayText,
      isClosed: true,
    };
  }

  return {
    dayText,
    isClosed: false,
    timeText: `${businessHour.open} - ${businessHour.close}`,
  };
};

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
