import { validateApiResponse, z, type ZodType } from '@dongchimi/shared/api';

import type { UserApiTypes } from '@/shared/api';

export type ProductDetailParamsTypes = Readonly<{
  marketId?: number;
  productId: string;
}>;

export const productDetailParamsSchema = z.object({
  marketId: z.number().int().positive(),
  productId: z.coerce.number().int().positive(),
});

export type ResolvedProductDetailParamsTypes = z.infer<typeof productDetailParamsSchema>;

export const resolveProductDetailParams = (
  rawParams: unknown,
): ResolvedProductDetailParamsTypes => {
  return productDetailParamsSchema.parse(rawParams);
};

export const hasProductDetailParams = (rawParams: ProductDetailParamsTypes) => {
  return productDetailParamsSchema.safeParse(rawParams).success;
};

type TodaySpecialPromotionTypes = Readonly<{
  discountRateText: string;
  originalPriceText: string;
  salePriceText: string;
  type: 'today-special';
}>;

type EventDiscountPromotionTypes = Readonly<{
  periodText: string;
  salePriceText: string;
  type: 'event-discount';
}>;

export type ProductDetailPromotionTypes = TodaySpecialPromotionTypes | EventDiscountPromotionTypes;

export type ProductDetailTypes = Readonly<{
  headerTitle: string;
  imageAlt: string;
  imageUrl?: string;
  marketName: string;
  martComment?: string;
  productName: string;
  promotion: ProductDetailPromotionTypes;
  promotionLabel: string;
}>;

const nullableStringSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

export const productDetailSchema = z.object({
  dealType: z.enum(['PERIODIC', 'DAILY']),
  discountedPrice: z.number(),
  discountEndDate: z.string(),
  discountRate: z.number().int(),
  discountStartDate: z.string(),
  marketName: z.string(),
  name: z.string(),
  originalPrice: z.number(),
  productId: z.number(),
  promotionalPhrase: nullableStringSchema,
  thumbnailUrl: nullableStringSchema,
}) satisfies ZodType<UserApiTypes.ProductDetailResponse>;

export type ProductDetailResponseTypes = z.infer<typeof productDetailSchema>;

const productDetailApiResponseSchema = z.object({
  code: z.string(),
  data: productDetailSchema.nullish(),
  message: z.string(),
  success: z.literal(true),
}) satisfies ZodType<UserApiTypes.ApiResponseProductDetailResponse>;

const TODAY_SPECIAL_DEAL_TYPE = 'DAILY';

const formatPrice = (price: number) => {
  return `${new Intl.NumberFormat('ko-KR').format(price)}원`;
};

const formatDateText = (date: string) => {
  const [, month, day] = date.split('-');

  if (month == null || day == null) {
    return date;
  }

  return `${Number(month)}.${Number(day)}`;
};

const getPeriodText = (startDate: string, endDate: string) => {
  return `${formatDateText(startDate)} ~ ${formatDateText(endDate)}`;
};

const mapProductDetail = (data: ProductDetailResponseTypes): ProductDetailTypes => {
  const isTodaySpecial = data.dealType === TODAY_SPECIAL_DEAL_TYPE;

  return {
    headerTitle: isTodaySpecial ? '오늘의 특가' : '행사 할인 상품',
    imageAlt: `${data.name} 상품 이미지`,
    imageUrl: data.thumbnailUrl ?? undefined,
    marketName: data.marketName,
    martComment: data.promotionalPhrase ?? undefined,
    productName: data.name,
    promotion: isTodaySpecial
      ? {
          discountRateText: `${data.discountRate}%`,
          originalPriceText: formatPrice(data.originalPrice),
          salePriceText: formatPrice(data.discountedPrice),
          type: 'today-special',
        }
      : {
          periodText: getPeriodText(data.discountStartDate, data.discountEndDate),
          salePriceText: formatPrice(data.discountedPrice),
          type: 'event-discount',
        },
    promotionLabel: isTodaySpecial ? '오늘의 특가' : '행사 할인 품목',
  };
};

export const resolveProductDetailResponse = (rawResponse: unknown): ProductDetailTypes | null => {
  const response = validateApiResponse(productDetailApiResponseSchema, rawResponse, {
    endpoint: 'GET /v1/users/markets/{marketId}/products/{productId}',
    schemaDescription: 'product detail response',
  });

  return response.data == null ? null : mapProductDetail(response.data);
};
