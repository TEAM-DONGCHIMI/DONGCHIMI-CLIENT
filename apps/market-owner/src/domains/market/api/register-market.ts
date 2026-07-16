import { API_ENDPOINTS, validateApiResponse, type z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

import { ownerMarketDetailResponseSchema } from '../model/market-detail-schema';

export type RegisterMarketRequestTypes = OwnerApiTypes.MarketRegisterRequest;

export type RegisterMarketResponseTypes = z.infer<typeof ownerMarketDetailResponseSchema>;

export const registerMarket = async (request: RegisterMarketRequestTypes) => {
  const endpoint = API_ENDPOINTS.owner.markets.root;
  const response = await httpClient.post<unknown>(endpoint, { json: request });

  return validateApiResponse(ownerMarketDetailResponseSchema, response, {
    endpoint,
    schemaDescription: 'Market registration response',
  });
};
