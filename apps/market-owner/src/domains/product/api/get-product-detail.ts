import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import {
  ownerProductDetailResponseSchema,
  type OwnerProductDetailApiResponseTypes,
} from './product-detail.schema';

export interface GetProductDetailParams {
  marketId: number;
  productId: number;
}

export type GetProductDetailResponseTypes = OwnerProductDetailApiResponseTypes;

export const getProductDetail = async ({
  marketId,
  productId,
}: GetProductDetailParams): Promise<GetProductDetailResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.detail(marketId, productId);
  const response = await httpClient.get<unknown>(endpoint);

  return validateApiResponse(ownerProductDetailResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner product detail response',
  });
};
