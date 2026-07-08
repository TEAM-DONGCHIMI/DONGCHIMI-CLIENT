import type { TodaySpecialProductFormTypes } from './product-form.types';

export {
  imageUploadErrorMessages as todaySpecialImageUploadErrorMessages,
  imageUploadInputAccept as todaySpecialImageInputAccept,
  isValidImageUploadFile as isValidTodaySpecialImageFile,
  revokeImagePreviewUrl as revokePreviewUrl,
} from '@/shared/utils/image-upload.utils';

// 입력 글자 수 제한
export const todaySpecialProductNameMaxLength = 15;
export const todaySpecialProductDescriptionMaxLength = 25;

// 빈 form 생성
export const createEmptyTodaySpecialProductForm = (): TodaySpecialProductFormTypes => ({
  category: '',
  description: '',
  imageFile: null,
  imagePreviewUrl: null,
  name: '',
  salePrice: '',
  specialPrice: '',
  startDate: '',
});

// 상품명 입력 중 15자 제한
export const limitProductNameInput = (value: string) => {
  return value.slice(0, todaySpecialProductNameMaxLength);
};

// 홍보문구 입력 중 25자 제한
export const limitProductDescriptionInput = (value: string) => {
  return value.slice(0, todaySpecialProductDescriptionMaxLength);
};

// 상품명 앞뒤 공백 제거
export const sanitizeProductName = (value: string) => {
  return limitProductNameInput(value.trim());
};

// 홍보문구 앞뒤 공백 제거
export const sanitizeProductDescription = (value: string) => {
  return limitProductDescriptionInput(value.trim());
};

// 숫자만 남기고, 1,000 단위로 콤마 추가
export const formatPriceInput = (value: string) => {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  return Number(digits).toLocaleString('ko-KR');
};

// 콤마 제거 후 숫자로 변환
export const parsePriceInput = (value: string) => {
  return Number(value.replace(/,/g, ''));
};
