import { z } from 'zod';

// form type
export interface TodaySpecialProductForm {
  category: string;
  description: string;
  endDate: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  name: string;
  salePrice: string;
  specialPrice: string;
  startDate: string;
}

export type TodaySpecialProductTextFieldTypes = keyof Pick<
  TodaySpecialProductForm,
  'description' | 'endDate' | 'name' | 'salePrice' | 'specialPrice' | 'startDate'
>;

export const todaySpecialImageFileTypes = ['image/jpeg', 'image/png'];
export const todaySpecialMaxImageFileSize = 10 * 1024 * 1024;
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

// 상품명 앞뒤 공백 제거, 15자 제한
export const sanitizeProductName = (value: string) => {
  return value.trim().slice(0, todaySpecialProductNameMaxLength);
};

// 홍보문구 앞뒤 공백 제거, 25자 제한
export const sanitizeProductDescription = (value: string) => {
  return value.trim().slice(0, todaySpecialProductDescriptionMaxLength);
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

const requiredTextSchema = z.string().trim().min(1);
const priceInputSchema = requiredTextSchema.transform(parsePriceInput).pipe(z.number().min(1));
const dateInputSchema = requiredTextSchema;

export const todaySpecialProductFormSchema = z
  .object({
    category: requiredTextSchema,
    description: z.string(),
    endDate: dateInputSchema,
    imageFile: z.file().nullable(),
    imagePreviewUrl: z.string().nullable(),
    name: requiredTextSchema.max(todaySpecialProductNameMaxLength),
    salePrice: priceInputSchema,
    specialPrice: priceInputSchema,
    startDate: dateInputSchema,
  })
  .refine((product) => product.salePrice >= product.specialPrice, {
    path: ['salePrice'],
  })
  .refine((product) => product.endDate >= product.startDate, {
    path: ['endDate'],
  });

// 시작일 변경 시 종료일이 시작일보다 이전이면 종료일 초기화
export const resolveEndDateAfterStartDateChange = (startDate: string, endDate: string) => {
  return endDate && endDate < startDate ? '' : endDate;
};

// 이미지 형식
export const isValidTodaySpecialImageFile = (file: File) => {
  return (
    todaySpecialImageFileTypes.includes(file.type) && file.size <= todaySpecialMaxImageFileSize
  );
};

// 등록 완료 버튼 활성화 조건
export const isTodaySpecialProductFormComplete = (product: TodaySpecialProductForm) => {
  return todaySpecialProductFormSchema.safeParse(product).success;
};

// object URL 정리
export const revokePreviewUrl = (previewUrl: string | null) => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
};
