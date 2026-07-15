import { useQuery } from '@tanstack/react-query';

import { productSearchQueryOptions, type ProductSearchQueryParamsTypes } from '../query-options';

export const useProductSearchQuery = (params: ProductSearchQueryParamsTypes) => {
  return useQuery(productSearchQueryOptions(params));
};
