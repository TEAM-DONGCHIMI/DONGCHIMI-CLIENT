import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import {
  mapProductDetailApiResponse,
  productDetailApiResponseSchema,
  type ProductDetailTypes,
} from '../model/product-detail';

export type ProductDetailParamsTypes = Readonly<{
  marketId: string;
  productId: string;
}>;

export type ProductDetailResponseTypes = ProductDetailTypes | null;

export const getProductDetail = async ({ marketId, productId }: ProductDetailParamsTypes) => {
  const endpoint = API_ENDPOINTS.user.products.detail(marketId, productId);
  const response = await httpClient.get<unknown>(endpoint);
  const productDetailResponse = validateApiResponse(productDetailApiResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseProductDetailResponse',
  });

  return mapProductDetailApiResponse(productDetailResponse);
};
