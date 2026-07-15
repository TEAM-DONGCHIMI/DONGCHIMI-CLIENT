import { useQuery } from '@tanstack/react-query';

import { productListQueryOptions, type ProductListQueryParamsTypes } from '../query-options';

export const useProductListQuery = (params: ProductListQueryParamsTypes) => {
  return useQuery(productListQueryOptions(params));
};
