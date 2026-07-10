'use client';

import { useQuery } from '@tanstack/react-query';

import { type ProductDetailParamsTypes } from '../api/product-detail-api';
import { productDetailQueryOptions } from '../query-options/product-detail-query-options';

const hasProductDetailParams = ({ marketId, productId }: ProductDetailParamsTypes) => {
  return marketId.length > 0 && productId.length > 0;
};

export const useProductDetailQuery = (params: ProductDetailParamsTypes) => {
  return useQuery({
    ...productDetailQueryOptions(params),
    enabled: hasProductDetailParams(params),
  });
};
