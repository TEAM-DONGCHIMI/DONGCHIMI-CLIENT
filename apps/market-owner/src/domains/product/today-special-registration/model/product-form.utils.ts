import type { TodaySpecialProductForm } from './product-form.types';

// 이미지 업로드 조건
export const todaySpecialImageFileTypes = ['image/jpeg', 'image/png'];
export const todaySpecialMaxImageFileSize = 10 * 1024 * 1024;

// 입력 글자 수 제한
export const todaySpecialProductNameMaxLength = 15;
export const todaySpecialProductDescriptionMaxLength = 25;

// 빈 form 생성
export const createEmptyTodaySpecialProductForm = (): TodaySpecialProductForm => ({
  category: '',
  description: '',
  endDate: '',
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

// 시작일 변경 시 종료일이 시작일보다 이전이면 종료일 초기화
export const resolveEndDateAfterStartDateChange = (startDate: string, endDate: string) => {
  return endDate && endDate < startDate ? '' : endDate;
};

// 이미지 형식, 용량 검증
export const isValidTodaySpecialImageFile = (file: File) => {
  return (
    todaySpecialImageFileTypes.includes(file.type) && file.size <= todaySpecialMaxImageFileSize
  );
};

// object URL 정리
export const revokePreviewUrl = (previewUrl: string | null) => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
};
