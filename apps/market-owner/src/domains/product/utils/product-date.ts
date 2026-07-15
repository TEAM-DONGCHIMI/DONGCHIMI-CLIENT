export const formatProductEditDateForInput = (date?: string) => {
  if (date == null) {
    return '';
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

export const getTodayDateInputValue = () => {
  const today = startOfToday();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getProductDateMinimum = (date?: string) => {
  const today = getTodayDateInputValue();
  const normalizedDate = formatProductEditDateForInput(date);

  return normalizedDate >= today ? normalizedDate : today;
};

export const isProductEditDateTodayOrFuture = (date?: string) => {
  const parsedDate = parseProductEditDate(date);

  if (parsedDate == null) {
    return false;
  }

  return parsedDate >= startOfToday();
};

export const isProductEditDateRangeValid = (startDate?: string, endDate?: string) => {
  const parsedStartDate = parseProductEditDate(startDate);
  const parsedEndDate = parseProductEditDate(endDate);

  if (parsedStartDate == null || parsedEndDate == null) {
    return false;
  }

  return parsedEndDate >= parsedStartDate;
};
