import {
  API_ENDPOINTS,
  type ApiPathParamTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

type FlyerQrApiResponseTypes = OwnerApiTypes.ApiResponseFlyerQrResponse;
export type FlyerQrResponseTypes = OwnerApiTypes.FlyerQrResponse;

const flyerQrResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    qrCode: z.string().min(1),
  }),
}) satisfies z.ZodType<FlyerQrApiResponseTypes>;

export const issueQrCode = async (marketId: ApiPathParamTypes): Promise<FlyerQrResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.flyers.qr(marketId);
  const response = await httpClient.post<unknown>(endpoint);
  const validatedResponse = validateApiResponse(flyerQrResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseFlyerQrResponse',
  });

  return validatedResponse.data;
};
