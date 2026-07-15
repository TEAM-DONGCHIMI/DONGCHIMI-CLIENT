import { useQuery } from '@tanstack/react-query';

import { type GetProductListParams } from '../api/get-product-list';
import { productListQueryOptions } from '../query-options';

export const useProductListQuery = (params: GetProductListParams) => {
  return useQuery(productListQueryOptions(params));
};
