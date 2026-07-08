import { z } from 'zod';

export const nearbyMarketsRequestQuerySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().positive().optional(),
  cursor: z.number().int().optional(),
  size: z.number().int().positive().optional(),
});

export type NearbyMarketsRequestQueryTypes = z.infer<typeof nearbyMarketsRequestQuerySchema>;

export const nearbyMarketPreviewProductSchema = z.object({
  productId: z.number(),
  name: z.string(),
  thumbnailUrl: z.string(),
  originalPrice: z.number(),
  discountedPrice: z.number(),
  discountRate: z.number(),
});

export type NearbyMarketPreviewProductTypes = z.infer<typeof nearbyMarketPreviewProductSchema>;

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

export type NearbyMarketsSuccessResponseTypes = z.infer<typeof nearbyMarketsSuccessResponseSchema>;

export const nearbyMarketsErrorResponseSchema = z.object({
  success: z.literal(false),
  code: z.string(),
  message: z.string(),
});

export type NearbyMarketsErrorResponseTypes = z.infer<typeof nearbyMarketsErrorResponseSchema>;

// Validates a raw success response body and resolves it to the typed `data` payload.
export const resolveNearbyMarketsResponse = (
  rawResponse: unknown,
): NearbyMarketsResponseDataTypes => {
  return nearbyMarketsSuccessResponseSchema.parse(rawResponse).data;
};
