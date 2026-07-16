import { useInfiniteQuery } from '@tanstack/react-query';

import {
  productListInfiniteQueryOptions,
  type ProductListQueryParamsTypes,
} from '../query-options';

export const useProductListInfiniteQuery = (params: ProductListQueryParamsTypes) => {
  return useInfiniteQuery(productListInfiniteQueryOptions(params));
};
