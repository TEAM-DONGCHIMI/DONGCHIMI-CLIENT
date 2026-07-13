import { z } from 'zod';

import { productNameMaxLength, productPromotionTextMaxLength } from '../../utils/product-input';

import { isTodaySpecialStartDateSelectable, parsePriceInput } from './product-form.utils';

// 필수 text 값
const requiredTextSchema = (message: string) => z.string().trim().min(1, { message });

// 가격은 콤마 포함 string 값을 숫자로 해석해서 검증
const createPriceInputSchema = (requiredMessage: string) =>
  requiredTextSchema(requiredMessage)
    .refine((value) => /^[\d,]+$/.test(value), {
      message: '숫자만 입력할 수 있습니다.',
    })
    .refine((value) => parsePriceInput(value) >= 1, {
      message: '1원 이상 입력해주세요.',
    });

// 상품명 필수, 15자 제한
const productNameSchema = requiredTextSchema('상품명을 입력해주세요.').max(productNameMaxLength, {
  message: '상품명은 공백 포함 15자 이하로 입력해주세요.',
});

// 홍보문구 선택 입력, 25자 제한
const productDescriptionSchema = z.string().trim().max(productPromotionTextMaxLength, {
  message: '홍보문구는 공백 포함 25자 이하로 입력해주세요.',
});

// 상품 1개의 제출 가능 여부 검증
export const todaySpecialProductFormSchema = z
  .object({
    category: requiredTextSchema('카테고리를 선택해주세요.'),
    description: productDescriptionSchema,
    imageFile: z.file().nullable(),
    imagePreviewUrl: z.string().nullable(),
    name: productNameSchema,
    salePrice: createPriceInputSchema('판매가를 입력해주세요.'),
    specialPrice: createPriceInputSchema('오늘의 특가를 입력해주세요.'),
    startDate: z.iso.date('행사 시작일을 선택해주세요.').refine(isTodaySpecialStartDateSelectable, {
      message: '오늘 이후 날짜를 선택해주세요.',
    }),
  })
  .superRefine((product, context) => {
    const salePrice = parsePriceInput(product.salePrice);
    const specialPrice = parsePriceInput(product.specialPrice);

    if (salePrice >= 1 && specialPrice >= 1 && salePrice < specialPrice) {
      context.addIssue({
        code: 'custom',
        message: '판매가는 오늘의 특가 이상으로 입력해주세요.',
        path: ['salePrice'],
      });
    }
  });

// 오늘의 특가 상품 등록 전체 form 검증
export const todaySpecialRegistrationFormSchema = z.object({
  products: z.array(todaySpecialProductFormSchema).min(1),
});
