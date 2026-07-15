import { queryOptions } from '@tanstack/react-query';

import { getProductDetail, type GetProductDetailParams } from './api/get-product-detail';
import { getProductList, type GetProductListParams } from './api/get-product-list';
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
    queryKey: [...productQueryKeys.list, queryParams],
    queryFn: () => getProductList(queryParams),
  });
};
