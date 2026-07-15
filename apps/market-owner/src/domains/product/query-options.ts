import { queryOptions } from '@tanstack/react-query';

import { getProductDetail, type GetProductDetailParams } from './api/get-product-detail';
import { getProductList, type GetProductListParams } from './api/get-product-list';
import { productQueryKeys } from './query-keys';

export const productDetailQueryOptions = (params: GetProductDetailParams) => {
  return queryOptions({
    queryKey: [...productQueryKeys.detail, params],
    queryFn: () => getProductDetail(params),
    throwOnError: false,
  });
};

export const productListQueryOptions = (params: GetProductListParams) => {
  const { marketId, sort = 'CATEGORY', type } = params;
  const queryParams = { marketId, sort, type };

  return queryOptions({
    queryKey: [...productQueryKeys.listByMarket(marketId), { sort, type }],
    queryFn: () => getProductList(queryParams),
  });
};
