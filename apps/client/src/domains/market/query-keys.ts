import { type ProductDetailParamsTypes } from './api/product-detail-api';

const normalizeProductDetailParams = ({ marketId, productId }: ProductDetailParamsTypes) => {
  return {
    marketId,
    productId,
  } satisfies ProductDetailParamsTypes;
};

export const productDetailQueryKeys = {
  all: ['market', 'products'] as const,
  detail: (params: ProductDetailParamsTypes) =>
    [...productDetailQueryKeys.all, 'detail', normalizeProductDetailParams(params)] as const,
  query: (params: ProductDetailParamsTypes) => productDetailQueryKeys.detail(params),
};
