import type {
  RegistrationResultEditableProductFieldTypes,
  RegistrationResultProductFieldValues,
} from '../model';

export type RegistrationResultProductFieldErrorTypes = Partial<
  Record<RegistrationResultEditableProductFieldTypes, string>
>;

const PRODUCT_NAME_MAX_LENGTH = 15;
const PROMOTION_TEXT_MAX_LENGTH = 30;
const PRICE_MAX_VALUE = 9_999_999;
const DATE_RANGE_PATTERN = /^(\d{4}-\d{2}-\d{2}) ~ (\d{4}-\d{2}-\d{2})$/;
const PRICE_PATTERN = /^(?:\d+|\d{1,3}(?:,\d{3})+)$/;

const formatDateDigits = (value: string) => {
  if (value.length <= 4) {
    return value;
  }

  if (value.length <= 6) {
    return `${value.slice(0, 4)}-${value.slice(4)}`;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
};

export const formatDiscountPeriodInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const startDate = formatDateDigits(digits.slice(0, 8));
  const endDate = formatDateDigits(digits.slice(8, 16));

  if (endDate.length === 0) {
    return startDate;
  }

  return `${startDate} ~ ${endDate}`;
};

export const getRegistrationResultFieldInputValue = (
  field: RegistrationResultEditableProductFieldTypes,
  value: string,
) => {
  if (field === 'discountPeriod') {
    return formatDiscountPeriodInput(value);
  }

  if (field === 'price') {
    return value.replace(/\D/g, '');
  }

  return value;
};

export const getRegistrationResultFieldBlurValue = (
  field: RegistrationResultEditableProductFieldTypes,
  value: string,
) => {
  if (field === 'productName' || field === 'promotionText') {
    return value.trim();
  }

  return value;
};

const getProductNameError = (value: string) => {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return '상품명을 입력해주세요.';
  }

  if (normalizedValue.length > PRODUCT_NAME_MAX_LENGTH) {
    return '상품명은 공백 포함 15자 이하로 입력해주세요.';
  }

  return undefined;
};

const getPriceError = (value: string) => {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return '가격을 입력해주세요.';
  }

  if (!PRICE_PATTERN.test(normalizedValue)) {
    return '가격은 숫자만 입력해주세요.';
  }

  const numericValue = Number(normalizedValue.replaceAll(',', ''));

  if (numericValue > PRICE_MAX_VALUE) {
    return '9,999,999원 이하로 입력해 주세요.';
  }

  return undefined;
};

const getCategoryError = (value: string) => {
  if (value.trim().length === 0) {
    return '카테고리 미입력';
  }

  return undefined;
};

const getPromotionTextError = (value: string) => {
  const normalizedValue = value.trim();

  if (normalizedValue.length > PROMOTION_TEXT_MAX_LENGTH) {
    return '홍보문구는 공백 포함 30자 이하로 입력해주세요.';
  }

  return undefined;
};

const isValidDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    year >= 1000 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const getUtcDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day));
};

const getOneYearLaterDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(Date.UTC(year + 1, month - 1, day));
};

const getDiscountPeriodError = (value: string) => {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return '할인 기간을 입력해주세요.';
  }

  const dateRangeMatch = normalizedValue.match(DATE_RANGE_PATTERN);

  if (dateRangeMatch == null) {
    return '올바른 날짜 형식으로 입력해주세요.';
  }

  const [, startDate, endDate] = dateRangeMatch;

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return '올바른 날짜 형식으로 입력해주세요.';
  }

  if (endDate < startDate) {
    return '종료일은 시작일 이후 날짜를 선택해주세요.';
  }

  if (getUtcDate(endDate) > getOneYearLaterDate(startDate)) {
    return '할인 기간은 최대 1년까지 설정 가능합니다.';
  }

  return undefined;
};

export const validateRegistrationResultProductFields = (
  fieldValues: RegistrationResultProductFieldValues,
): RegistrationResultProductFieldErrorTypes => {
  const errors: RegistrationResultProductFieldErrorTypes = {};
  const productNameError = getProductNameError(fieldValues.productName);
  const priceError = getPriceError(fieldValues.price);
  const categoryError = getCategoryError(fieldValues.category);
  const promotionTextError = getPromotionTextError(fieldValues.promotionText);
  const discountPeriodError = getDiscountPeriodError(fieldValues.discountPeriod);

  if (productNameError != null) {
    errors.productName = productNameError;
  }

  if (priceError != null) {
    errors.price = priceError;
  }

  if (categoryError != null) {
    errors.category = categoryError;
  }

  if (promotionTextError != null) {
    errors.promotionText = promotionTextError;
  }

  if (discountPeriodError != null) {
    errors.discountPeriod = discountPeriodError;
  }

  return errors;
};
