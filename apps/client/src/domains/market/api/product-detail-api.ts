import { buildApiPath } from '@dongchimi/shared/api';

import { browserApi } from '@/shared/api';

import {
  resolveProductDetailParams,
  resolveProductDetailResponse,
  type ProductDetailParamsTypes,
  type ProductDetailTypes,
} from '../model/product-detail-schema';

export type { ProductDetailParamsTypes } from '../model/product-detail-schema';

export const getProductDetail = async (
  rawParams: ProductDetailParamsTypes,
): Promise<ProductDetailTypes | null> => {
  const { marketId, productId } = resolveProductDetailParams(rawParams);
  const endpoint = buildApiPath(`products/${productId}`, { marketId });
  const response = await browserApi.get<unknown>(endpoint);

  return resolveProductDetailResponse(response);
};
