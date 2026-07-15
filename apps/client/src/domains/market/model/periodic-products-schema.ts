import { validateApiResponse, z, type ZodType } from '@dongchimi/shared/api';

import type { UserApiTypes } from '@/shared/api';

export const PERIODIC_PRODUCT_CATEGORIES = [
  'VEGETABLE_FRUIT',
  'MEAT_EGG',
  'SEAFOOD',
  'DAIRY',
  'CONVENIENCE_FOOD',
  'PROCESSED_FOOD',
  'BEVERAGE_ALCOHOL',
  'HOUSEHOLD_GOODS',
  'ETC',
] as const;

export const DEFAULT_PERIODIC_PRODUCTS_PAGE_SIZE = 12;

export const periodicProductCategorySchema = z.enum(PERIODIC_PRODUCT_CATEGORIES);

export type PeriodicProductCategoryTypes = z.infer<typeof periodicProductCategorySchema>;

export const periodicProductsListParamsSchema = z.object({
  category: periodicProductCategorySchema.optional(),
  marketId: z.number().int().positive(),
  size: z.number().int().positive().max(60).default(DEFAULT_PERIODIC_PRODUCTS_PAGE_SIZE),
});

export type PeriodicProductsListParamsTypes = z.input<typeof periodicProductsListParamsSchema>;

export const periodicProductsParamsSchema = periodicProductsListParamsSchema.extend({
  cursor: z.number().int().positive().optional(),
});

export type PeriodicProductsParamsTypes = z.input<typeof periodicProductsParamsSchema>;

export const periodicProductSchema = z.object({
  discountedPrice: z.number(),
  name: z.string(),
  productId: z.number(),
  thumbnailUrl: z.string().nullish(),
}) satisfies ZodType<UserApiTypes.PeriodicProductResponse>;

export type PeriodicProductTypes = z.infer<typeof periodicProductSchema>;

export const periodicProductsPageSchema = z.object({
  content: z.array(periodicProductSchema),
  hasNext: z.boolean(),
  nextCursor: z
    .number()
    .int()
    .positive()
    .nullish()
    .transform((value) => value ?? null),
}) satisfies ZodType<UserApiTypes.CursorSliceResponsePeriodicProductResponse>;

export type PeriodicProductsPageTypes = z.infer<typeof periodicProductsPageSchema>;

const periodicProductsResponseSchema = z.object({
  code: z.string(),
  data: periodicProductsPageSchema,
  message: z.string(),
  success: z.literal(true),
}) satisfies ZodType<UserApiTypes.ApiResponseCursorSliceResponsePeriodicProductResponse>;

export const resolvePeriodicProductsParams = (rawParams: unknown) => {
  return periodicProductsParamsSchema.parse(rawParams);
};

export const resolvePeriodicProductsResponse = (
  rawResponse: unknown,
  endpoint: string,
): PeriodicProductsPageTypes => {
  return validateApiResponse(periodicProductsResponseSchema, rawResponse, {
    endpoint,
    schemaDescription: 'periodic products response',
  }).data;
};
