import { validateApiResponse, z, type ZodType } from '@dongchimi/shared/api';

import type { UserApiTypes } from '@/shared/api';

export const dailyProductsParamsSchema = z.object({
  marketId: z.number().int().positive(),
});

export type DailyProductsParamsTypes = z.infer<typeof dailyProductsParamsSchema>;

const nullableStringSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

export const dailyProductSchema = z.object({
  discountRate: z.number(),
  discountedPrice: z.number(),
  name: z.string(),
  originalPrice: z.number(),
  productId: z.number(),
  thumbnailUrl: nullableStringSchema,
}) satisfies ZodType<UserApiTypes.DailyProductResponse>;

export type DailyProductTypes = z.infer<typeof dailyProductSchema>;

export const dailyProductsSchema = z.object({
  products: z.array(dailyProductSchema),
  totalCount: z.number().int().nonnegative(),
}) satisfies ZodType<UserApiTypes.DailyProductListResponse>;

export type DailyProductsTypes = z.infer<typeof dailyProductsSchema>;

const dailyProductsResponseSchema = z.object({
  code: z.string(),
  data: dailyProductsSchema,
  message: z.string(),
  success: z.literal(true),
}) satisfies ZodType<UserApiTypes.ApiResponseDailyProductListResponse>;

export const resolveDailyProductsParams = (rawParams: unknown): DailyProductsParamsTypes => {
  return dailyProductsParamsSchema.parse(rawParams);
};

export const resolveDailyProductsResponse = (
  rawResponse: unknown,
  endpoint: string,
): DailyProductsTypes => {
  return validateApiResponse(dailyProductsResponseSchema, rawResponse, {
    endpoint,
    schemaDescription: 'daily products response',
  }).data;
};
