import { useQuery } from '@tanstack/react-query';

import { type GetProductDetailParams } from '../api/get-product-detail';
import { productDetailQueryOptions } from '../query-options';

export const useProductDetailQuery = (params: GetProductDetailParams) => {
  return useQuery(productDetailQueryOptions(params));
};
