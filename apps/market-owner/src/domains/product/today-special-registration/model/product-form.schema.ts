import { z } from 'zod';

import { parsePriceInput, todaySpecialProductNameMaxLength } from './product-form.utils';

// 필수 text 값
const requiredTextSchema = z.string().trim().min(1);

// 가격은 콤마 포함 string 값을 숫자로 해석해서 검증
const priceInputSchema = requiredTextSchema.refine((value) => parsePriceInput(value) >= 1);

// date input 값은 YYYY-MM-DD ISO date string
const dateInputSchema = z.iso.date();

// 상품 1개의 제출 가능 여부 검증
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
  .refine(
    (product) => parsePriceInput(product.salePrice) >= parsePriceInput(product.specialPrice),
    {
      path: ['salePrice'],
    },
  )
  .refine((product) => product.endDate >= product.startDate, {
    path: ['endDate'],
  });

// 오늘의 특가 상품 등록 전체 form 검증
export const todaySpecialRegistrationFormSchema = z.object({
  products: z.array(todaySpecialProductFormSchema).min(1),
});
