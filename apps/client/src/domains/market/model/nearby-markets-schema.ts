import { z } from '@dongchimi/shared/api';

export const nearbyMarketPreviewProductSchema = z.object({
  productId: z.number(),
  name: z.string(),
  thumbnailUrl: z.string(),
  originalPrice: z.number(),
  discountedPrice: z.number(),
  discountRate: z.number(),
});

export const nearbyMarketDtoSchema = z.object({
  marketId: z.number(),
  name: z.string(),
  slug: z.string(),
  thumbnailUrl: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  distance: z.string().optional().default(''),
  isOpen: z.boolean(),
  productCount: z.number(),
  previewProducts: z.array(nearbyMarketPreviewProductSchema),
});

export type NearbyMarketDtoTypes = z.infer<typeof nearbyMarketDtoSchema>;

const nearbyMarketsContentsResponseDataSchema = z.object({
  hasNext: z.boolean(),
  nextCursor: z.number().nullable(),
  contents: z.array(nearbyMarketDtoSchema),
});

const nearbyMarketsContentResponseDataSchema = z
  .object({
    hasNext: z.boolean(),
    nextCursor: z.number().nullable(),
    content: z.array(nearbyMarketDtoSchema),
  })
  .transform(({ content, ...data }) => ({
    ...data,
    contents: content,
  }));

export const nearbyMarketsResponseDataSchema = z.union([
  nearbyMarketsContentsResponseDataSchema,
  nearbyMarketsContentResponseDataSchema,
]);

export type NearbyMarketsResponseDataTypes = z.infer<typeof nearbyMarketsResponseDataSchema>;

export const nearbyMarketsSuccessResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: nearbyMarketsResponseDataSchema,
});

export const resolveNearbyMarketsResponse = (
  rawResponse: unknown,
): NearbyMarketsResponseDataTypes => {
  return nearbyMarketsSuccessResponseSchema.parse(rawResponse).data;
};

const optionalTrimmedNonEmptyStringSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.string().min(1).optional());

export const nearbyMarketsListParamsSchema = z.object({
  keyword: optionalTrimmedNonEmptyStringSchema,
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  radius: z.number().positive().optional(),
  size: z.number().int().positive().optional(),
});

export type NearbyMarketsListParamsTypes = z.infer<typeof nearbyMarketsListParamsSchema>;

export const nearbyMarketsParamsSchema = nearbyMarketsListParamsSchema.extend({
  cursor: z.number().int().nonnegative().optional(),
});

export type NearbyMarketsParamsTypes = z.infer<typeof nearbyMarketsParamsSchema>;

export const nearbyMarketsLocationParamsSchema = nearbyMarketsParamsSchema.extend({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type NearbyMarketsLocationParamsTypes = z.infer<typeof nearbyMarketsLocationParamsSchema>;

export const resolveNearbyMarketsParams = (rawParams: unknown): NearbyMarketsParamsTypes => {
  return nearbyMarketsParamsSchema.parse(rawParams);
};

export const resolveNearbyMarketsLocationParams = (
  rawParams: unknown,
): NearbyMarketsLocationParamsTypes => {
  return nearbyMarketsLocationParamsSchema.parse(rawParams);
};
