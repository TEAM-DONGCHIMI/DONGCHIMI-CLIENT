import { useQuery } from '@tanstack/react-query';

import { type GetProductSearchParams } from '../api/get-product-search';
import { productSearchQueryOptions } from '../query-options';

export const useProductSearchQuery = (params: GetProductSearchParams) => {
  return useQuery(productSearchQueryOptions(params));
};
