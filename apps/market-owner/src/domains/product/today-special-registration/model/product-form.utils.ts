import type { TodaySpecialProductFormTypes } from './product-form.types';

import { getTodayDateInputValue as getCommonTodayDateInputValue } from '../../utils/product-date';
import {
  formatProductPriceInput,
  limitProductNameInput,
  limitProductPromotionTextInput,
  sanitizeProductName,
  sanitizeProductPromotionText,
} from '../../utils/product-input';

export { limitProductNameInput, sanitizeProductName };
export const limitProductDescriptionInput = limitProductPromotionTextInput;
export const sanitizeProductDescription = sanitizeProductPromotionText;

export const getTodayDateInputValue = getCommonTodayDateInputValue;

export const isTodaySpecialStartDateSelectable = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return value >= getTodayDateInputValue();
};

export const normalizeTodaySpecialStartDateInput = (value: string) => {
  if (!value) {
    return value;
  }

  return isTodaySpecialStartDateSelectable(value) ? value : getTodayDateInputValue();
};

// 빈 form 생성
export const createEmptyTodaySpecialProductForm = (): TodaySpecialProductFormTypes => ({
  category: '',
  description: '',
  imageFile: null,
  imagePreviewUrl: null,
  name: '',
  salePrice: '',
  specialPrice: '',
  startDate: getTodayDateInputValue(),
});

export const formatPriceInput = formatProductPriceInput;

// 콤마 제거 후 숫자로 변환
export const parsePriceInput = (value: string) => {
  return Number(value.replace(/,/g, ''));
};
