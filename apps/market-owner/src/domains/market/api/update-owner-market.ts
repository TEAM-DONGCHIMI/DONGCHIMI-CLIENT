import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type UpdateOwnerMarketRequestTypes = OwnerApiTypes.MarketUpdateRequest;

const updateOwnerMarketResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
});

export type UpdateOwnerMarketResponseTypes = z.infer<typeof updateOwnerMarketResponseSchema>;

export interface UpdateOwnerMarketParams {
  marketId: number;
  request: UpdateOwnerMarketRequestTypes;
}

export const updateOwnerMarket = async ({ marketId, request }: UpdateOwnerMarketParams) => {
  const endpoint = API_ENDPOINTS.owner.markets.detail(marketId);
  const response = await httpClient.put<unknown>(endpoint, { json: request });

  return validateApiResponse(updateOwnerMarketResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner market update response',
  });
};
