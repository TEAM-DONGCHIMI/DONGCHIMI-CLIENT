const DEFAULT_DATE = '2026-08-16';

export const formatProductEditDateForInput = (date?: string) => {
  if (date == null) {
    return DEFAULT_DATE;
  }

  const match = date.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);

  if (match == null) {
    return date;
  }

  const [, year, month, day] = match;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const addOneDayToProductEditDate = (date: string) => {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match == null) {
    return date;
  }

  const [, year, month, day] = match;
  const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  parsedDate.setUTCDate(parsedDate.getUTCDate() + 1);

  return parsedDate.toISOString().slice(0, 10);
};

const parseProductEditDate = (date?: string) => {
  if (date == null) {
    return null;
  }

  const match = date.match(/(\d{4})[.-]\s*(\d{1,2})[.-]\s*(\d{1,2})/);

  if (match == null) {
    return null;
  }

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day));
};

const startOfToday = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
};

export const isProductEditDateTodayOrFuture = (date?: string) => {
  const parsedDate = parseProductEditDate(date);

  if (parsedDate == null) {
    return false;
  }

  return parsedDate >= startOfToday();
};
