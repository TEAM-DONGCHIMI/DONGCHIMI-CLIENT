import { queryOptions } from '@tanstack/react-query';

import { getProductList, type GetProductListParams } from './api/get-product-list';
import { productQueryKeys } from './query-keys';

export const productListQueryOptions = (params: GetProductListParams) => {
  const { marketId, sort = 'CATEGORY', type } = params;
  const queryParams = { marketId, sort, type };

  return queryOptions({
    queryKey: [...productQueryKeys.list, queryParams],
    queryFn: () => getProductList(queryParams),
  });
};
