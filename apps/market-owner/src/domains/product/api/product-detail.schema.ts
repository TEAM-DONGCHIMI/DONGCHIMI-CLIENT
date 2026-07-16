import { z } from '@dongchimi/shared/api';

import { type OwnerApiTypes } from '@/shared/api';

const productCategorySchema = z.enum([
  'VEGETABLE_FRUIT',
  'MEAT_EGG',
  'SEAFOOD',
  'DAIRY',
  'CONVENIENCE_FOOD',
  'PROCESSED_FOOD',
  'BEVERAGE_ALCOHOL',
  'HOUSEHOLD_GOODS',
  'ETC',
]) satisfies z.ZodType<OwnerApiTypes.OwnerProductDetailResponse['category']>;

export const ownerProductDetailResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    productId: z.number(),
    name: z.string(),
    dealType: z.enum(['PERIODIC', 'DAILY']),
    thumbnailUrl: z.string().nullable().optional(),
    originalPrice: z.number(),
    discountedPrice: z.number(),
    category: productCategorySchema,
    categoryName: z.string(),
    promotionalPhrase: z.string().nullable().optional(),
    discountStartDate: z.string(),
    discountEndDate: z.string(),
  }),
}) satisfies z.ZodType<OwnerApiTypes.ApiResponseOwnerProductDetailResponse>;

export type OwnerProductDetailApiResponseTypes = z.infer<typeof ownerProductDetailResponseSchema>;
