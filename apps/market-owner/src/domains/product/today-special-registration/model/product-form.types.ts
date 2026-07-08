// 상품 1개의 form 값
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

// 필드별 error message
export type TodaySpecialProductErrorMessageTypes = Partial<
  Record<keyof TodaySpecialProductForm, string>
>;

// input으로 직접 변경하는 text field
export type TodaySpecialProductTextFieldTypes = keyof Pick<
  TodaySpecialProductForm,
  'description' | 'endDate' | 'name' | 'salePrice' | 'specialPrice' | 'startDate'
>;

// 오늘의 특가 상품 등록 전체 form 값
export interface TodaySpecialRegistrationForm {
  products: TodaySpecialProductForm[];
}
