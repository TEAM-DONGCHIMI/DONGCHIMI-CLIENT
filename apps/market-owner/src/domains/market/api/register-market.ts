import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type RegisterMarketRequestTypes = OwnerApiTypes.MarketRegisterRequest;

const registerMarketResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    marketId: z.number().int(),
  }),
});

export type RegisterMarketResponseTypes = z.infer<typeof registerMarketResponseSchema>;

export const registerMarket = async (request: RegisterMarketRequestTypes) => {
  const endpoint = API_ENDPOINTS.owner.markets.root;
  const response = await httpClient.post<unknown>(endpoint, { json: request });

  return validateApiResponse(registerMarketResponseSchema, response, {
    endpoint,
    schemaDescription: 'Market registration response',
  });
};
