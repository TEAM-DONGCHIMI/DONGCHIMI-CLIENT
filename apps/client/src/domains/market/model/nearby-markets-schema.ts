import { z } from 'zod';

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
  thumbnailUrl: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  distance: z.string(),
  isOpen: z.boolean(),
  productCount: z.number(),
  previewProducts: z.array(nearbyMarketPreviewProductSchema),
});

export type NearbyMarketDtoTypes = z.infer<typeof nearbyMarketDtoSchema>;

export const nearbyMarketsResponseDataSchema = z.object({
  totalCount: z.number(),
  hasNext: z.boolean(),
  nextCursor: z.number().nullable(),
  markets: z.array(nearbyMarketDtoSchema),
});

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

export const nearbyMarketsListParamsSchema = z.object({
  keyword: z.string().trim().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pageSize: z.number().int().positive().optional(),
});

export type NearbyMarketsListParamsTypes = z.infer<typeof nearbyMarketsListParamsSchema>;

export const nearbyMarketsParamsSchema = nearbyMarketsListParamsSchema.extend({
  cursor: z.number().int().nonnegative().optional(),
});

export type NearbyMarketsParamsTypes = z.infer<typeof nearbyMarketsParamsSchema>;

export const resolveNearbyMarketsParams = (rawParams: unknown): NearbyMarketsParamsTypes => {
  return nearbyMarketsParamsSchema.parse(rawParams);
};
