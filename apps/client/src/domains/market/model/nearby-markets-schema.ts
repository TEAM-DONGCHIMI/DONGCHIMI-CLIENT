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

// Validates a raw success response body and resolves it to the typed `data` payload.
export const resolveNearbyMarketsResponse = (
  rawResponse: unknown,
): NearbyMarketsResponseDataTypes => {
  return nearbyMarketsSuccessResponseSchema.parse(rawResponse).data;
};
