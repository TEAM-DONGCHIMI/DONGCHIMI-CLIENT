import { validateApiResponse, z, type ZodType } from '@dongchimi/shared/api';

import type { UserApiTypes } from '@/shared/api';

export const marketDetailParamsSchema = z.object({
  slug: z.string().min(1),
});

export type MarketDetailParamsTypes = z.infer<typeof marketDetailParamsSchema>;

export const resolveMarketDetailParams = (rawParams: unknown): MarketDetailParamsTypes => {
  return marketDetailParamsSchema.parse(rawParams);
};

export const businessDaySchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

export type BusinessDayTypes = z.infer<typeof businessDaySchema>;

const businessTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, '영업시간은 HH:mm 형식이어야 합니다.');

export const businessHourSchema = z.discriminatedUnion('isOpen', [
  z.object({
    close: businessTimeSchema,
    days: z.array(businessDaySchema),
    isOpen: z.literal(true),
    open: businessTimeSchema,
  }),
  z.object({
    close: z.never().optional(),
    days: z.array(businessDaySchema),
    isOpen: z.literal(false),
    open: z.never().optional(),
  }),
]);

export type BusinessHourTypes = z.infer<typeof businessHourSchema>;

const nullableStringSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

export const popularProductSchema = z.object({
  discountedPrice: z.number(),
  discountRate: z.number(),
  name: z.string(),
  productId: z.number(),
  thumbnailUrl: nullableStringSchema,
});

export type PopularProductTypes = z.infer<typeof popularProductSchema>;

export const marketDetailSchema = z.object({
  address: z.string(),
  businessHours: z.array(businessHourSchema),
  isOpenNow: z.boolean(),
  marketId: z.number().int().positive(),
  marketPhone1: z.string(),
  marketPhone2: nullableStringSchema,
  name: z.string(),
  ownerPhone: z.string(),
  thumbnailUrl: nullableStringSchema,
  top3: z.array(popularProductSchema),
}) satisfies ZodType<UserApiTypes.MarketDetailResponse>;

export type MarketDetailTypes = z.infer<typeof marketDetailSchema>;

const marketDetailResponseSchema = z.object({
  code: z.string(),
  data: marketDetailSchema,
  message: z.string(),
  success: z.literal(true),
}) satisfies ZodType<UserApiTypes.ApiResponseMarketDetailResponse>;

export const resolveMarketDetailResponse = (rawResponse: unknown): MarketDetailTypes => {
  return validateApiResponse(marketDetailResponseSchema, rawResponse, {
    endpoint: 'GET /v1/users/markets/{slug}',
    schemaDescription: 'market detail response',
  }).data;
};
