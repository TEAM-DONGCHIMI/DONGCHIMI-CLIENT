'use client';

import { useQuery } from '@tanstack/react-query';

import { type ProductDetailParamsTypes } from '../api/product-detail-api';
import { hasProductDetailParams } from '../model/product-detail-schema';
import { productDetailQueryOptions } from '../query-options/product-detail-query-options';

export const useProductDetailQuery = (params: ProductDetailParamsTypes) => {
  return useQuery({
    ...productDetailQueryOptions(params),
    enabled: hasProductDetailParams(params),
  });
};
