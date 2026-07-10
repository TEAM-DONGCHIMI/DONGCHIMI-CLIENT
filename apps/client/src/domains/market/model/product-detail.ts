import { z } from '@dongchimi/shared/api';

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

export const productDetailApiResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z
    .object({
      productId: z.number(),
      name: z.string(),
      dealType: z.string(),
      thumbnailUrl: z.string().nullable().optional(),
      originalPrice: z.number(),
      discountedPrice: z.number(),
      discountRate: z.number().int(),
      promotionalPhrase: z.string().nullable().optional(),
      discountStartDate: z.string(),
      discountEndDate: z.string(),
      marketName: z.string(),
    })
    .nullable()
    .optional(),
});

export type ProductDetailApiResponseTypes = z.infer<typeof productDetailApiResponseSchema>;

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

export const mapProductDetailApiResponse = (
  response: ProductDetailApiResponseTypes,
): ProductDetailTypes | null => {
  const { data } = response;

  if (data == null) {
    return null;
  }

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
