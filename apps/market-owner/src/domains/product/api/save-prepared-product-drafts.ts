import {
  API_ENDPOINTS,
  type ApiPathParamTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type SavePreparedProductDraftsRequestTypes = OwnerApiTypes.PreparedProductDraftSaveRequest;
export type SavePreparedProductDraftsResponseTypes = OwnerApiTypes.SaveDraftsData;

export interface SavePreparedProductDraftsParams {
  marketId: ApiPathParamTypes;
  request: SavePreparedProductDraftsRequestTypes;
}

const savePreparedProductDraftsResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
}) satisfies z.ZodType<SavePreparedProductDraftsResponseTypes>;

export const savePreparedProductDrafts = async ({
  marketId,
  request,
}: SavePreparedProductDraftsParams): Promise<SavePreparedProductDraftsResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.draft(marketId);
  const response = await httpClient.put<unknown>(endpoint, {
    json: request,
  });

  return validateApiResponse(savePreparedProductDraftsResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner prepared product draft save response',
  });
};
