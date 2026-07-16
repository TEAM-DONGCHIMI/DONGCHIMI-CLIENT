import {
  API_ENDPOINTS,
  type ApiPathParamTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

type FlyerPreviewApiResponseTypes = OwnerApiTypes.ApiResponseFlyerPreviewResponse;
export type FlyerPreviewResponseTypes = OwnerApiTypes.FlyerPreviewResponse;

const businessDaySchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

const flyerPreviewBusinessHourResponseSchema = z.object({
  days: z.array(businessDaySchema),
  isOpen: z.boolean(),
  open: z.string().nullable().optional(),
  close: z.string().nullable().optional(),
});

const flyerPreviewProductResponseSchema = z.object({
  productId: z.number().int(),
  name: z.string(),
  thumbnailUrl: z.string().nullable().optional(),
  discountedPrice: z.number(),
  discountRate: z.number().int(),
});

const flyerPreviewDailyProductResponseSchema = flyerPreviewProductResponseSchema.extend({
  originalPrice: z.number(),
});

const flyerPreviewPreparedProductResponseSchema = z.object({
  preparedProductId: z.number().int(),
  name: z.string(),
  thumbnailUrl: z.string(),
  discountedPrice: z.number(),
});

const flyerPreviewResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    marketId: z.number().int(),
    name: z.string(),
    thumbnailUrl: z.string().nullable().optional(),
    address: z.string(),
    isOpenNow: z.boolean(),
    isHolidayClosed: z.boolean(),
    businessHours: z.array(flyerPreviewBusinessHourResponseSchema),
    marketPhone1: z.string(),
    marketPhone2: z.string().nullable().optional(),
    ownerPhone: z.string(),
    top3: z.array(flyerPreviewProductResponseSchema),
    daily: z.object({
      totalCount: z.number().int(),
      products: z.array(flyerPreviewDailyProductResponseSchema),
    }),
    preparedProducts: z.array(flyerPreviewPreparedProductResponseSchema),
  }),
}) satisfies z.ZodType<FlyerPreviewApiResponseTypes>;

export const getPeriodicPreview = async (
  marketId: ApiPathParamTypes,
): Promise<FlyerPreviewResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.flyers.periodicPreview(marketId);
  const response = await httpClient.get<unknown>(endpoint);
  const validatedResponse = validateApiResponse(flyerPreviewResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseFlyerPreviewResponse',
  });

  return validatedResponse.data;
};
