import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import {
  ownerMarketDetailResponseSchema,
  type OwnerMarketDetailTypes,
} from '../model/market-detail-schema';

export const getOwnerMarketDetail = async (marketId: number): Promise<OwnerMarketDetailTypes> => {
  const endpoint = API_ENDPOINTS.owner.markets.detail(marketId);
  const response = await httpClient.get<unknown>(endpoint);
  const validatedResponse = validateApiResponse(ownerMarketDetailResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner market detail response',
  });

  return validatedResponse.data;
};
