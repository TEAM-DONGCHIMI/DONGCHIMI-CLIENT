import {
  API_ENDPOINTS,
  type ApiPathParamTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

type FlyerPublishApiResponseTypes = OwnerApiTypes.ApiResponseFlyerPublishResponse;
export type FlyerPublishResponseTypes = OwnerApiTypes.FlyerPublishResponse;

const flyerPublishResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    slug: z.string().min(1),
  }),
}) satisfies z.ZodType<FlyerPublishApiResponseTypes>;

export const publishLeaflet = async (
  marketId: ApiPathParamTypes,
): Promise<FlyerPublishResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.flyers.publish(marketId);
  const response = await httpClient.post<unknown>(endpoint);
  const validatedResponse = validateApiResponse(flyerPublishResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseFlyerPublishResponse',
  });

  return validatedResponse.data;
};
