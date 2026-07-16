import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

import {
  ownerProductDetailResponseSchema,
  type OwnerProductDetailApiResponseTypes,
} from './product-detail.schema';

export type RegisterDailyProductRequestTypes = OwnerApiTypes.DailyProductRegisterRequest;
export type RegisterDailyProductResponseTypes = OwnerProductDetailApiResponseTypes;

export interface RegisterDailyProductParams {
  marketId: number;
  request: RegisterDailyProductRequestTypes;
}

export const registerDailyProduct = async ({
  marketId,
  request,
}: RegisterDailyProductParams): Promise<RegisterDailyProductResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.daily(marketId);
  const response = await httpClient.post<unknown>(endpoint, {
    json: request,
  });

  return validateApiResponse(ownerProductDetailResponseSchema, response, {
    endpoint,
    schemaDescription: 'Daily product registration response',
  });
};
