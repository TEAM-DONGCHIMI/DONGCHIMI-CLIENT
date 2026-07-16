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

// generated string[] 카테고리를 화면이 지원하는 enum으로 좁혀 검증한다.
type PeriodicProductsPageContractTypes = UserApiTypes.PeriodicProductListResponse & {
  availableCategories: PeriodicProductCategoryTypes[];
};

type PeriodicProductsResponseContractTypes = Omit<
  UserApiTypes.ApiResponsePeriodicProductListResponse,
  'data'
> & {
  data?: PeriodicProductsPageContractTypes | null;
};

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
  discountedPrice: z.number().nonnegative(),
  name: z.string().min(1),
  productId: z.number().int().positive(),
  thumbnailUrl: z.string().nullish(),
}) satisfies ZodType<UserApiTypes.PeriodicProductResponse>;

export type PeriodicProductTypes = z.infer<typeof periodicProductSchema>;

export const periodicProductsPageSchema = z.object({
  availableCategories: z.array(periodicProductCategorySchema),
  content: z.array(periodicProductSchema),
  hasNext: z.boolean(),
  nextCursor: z
    .number()
    .int()
    .positive()
    .nullish()
    .transform((value) => value ?? null),
}) satisfies ZodType<PeriodicProductsPageContractTypes>;

export type PeriodicProductsPageTypes = z.infer<typeof periodicProductsPageSchema>;

const periodicProductsResponseSchema = z.object({
  code: z.string(),
  data: periodicProductsPageSchema,
  message: z.string(),
  success: z.literal(true),
}) satisfies ZodType<PeriodicProductsResponseContractTypes>;

export type PeriodicProductsResponseTypes = z.input<typeof periodicProductsResponseSchema>;

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
