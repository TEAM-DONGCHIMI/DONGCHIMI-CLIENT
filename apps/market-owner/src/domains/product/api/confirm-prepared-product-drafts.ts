import {
  API_ENDPOINTS,
  type ApiPathParamTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type ConfirmPreparedProductDraftsResponseTypes = OwnerApiTypes.ConfirmDraftsData;

const confirmPreparedProductDraftsResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
}) satisfies z.ZodType<ConfirmPreparedProductDraftsResponseTypes>;

export const confirmPreparedProductDrafts = async (
  marketId: ApiPathParamTypes,
): Promise<ConfirmPreparedProductDraftsResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.confirmDrafts(marketId);
  const response = await httpClient.post<unknown>(endpoint);

  return validateApiResponse(confirmPreparedProductDraftsResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner prepared product draft confirmation response',
  });
};
