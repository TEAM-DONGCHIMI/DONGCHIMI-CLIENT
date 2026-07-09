import type { z } from 'zod';

import type {
  todaySpecialProductFormSchema,
  todaySpecialRegistrationFormSchema,
} from './product-form.schema';

// 상품 1개의 form 값
export type TodaySpecialProductFormTypes = z.infer<typeof todaySpecialProductFormSchema>;

// 필드별 error message
export type TodaySpecialProductErrorMessageTypes = Partial<
  Record<keyof TodaySpecialProductFormTypes, string>
>;

// input으로 직접 변경하는 text field
export type TodaySpecialProductTextFieldTypes = keyof Pick<
  TodaySpecialProductFormTypes,
  'description' | 'name' | 'salePrice' | 'specialPrice' | 'startDate'
>;

// 오늘의 특가 상품 등록 전체 form 값
export type TodaySpecialRegistrationFormTypes = z.infer<typeof todaySpecialRegistrationFormSchema>;
