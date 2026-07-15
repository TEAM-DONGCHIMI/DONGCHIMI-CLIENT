import { queryOptions } from '@tanstack/react-query';

import { getProductSearch, type GetProductSearchParams } from './api/get-product-search';
import { productQueryKeys } from './query-keys';

const DEFAULT_PRODUCT_SEARCH_SIZE = 10;

export const productSearchQueryOptions = (params: GetProductSearchParams) => {
  const queryParams = {
    keyword: params.keyword.trim(),
    marketId: params.marketId,
    size: params.size ?? DEFAULT_PRODUCT_SEARCH_SIZE,
  };

  return queryOptions({
    enabled: queryParams.keyword.length > 0,
    queryKey: [...productQueryKeys.search, queryParams],
    queryFn: () => getProductSearch(queryParams),
    throwOnError: false,
  });
};
