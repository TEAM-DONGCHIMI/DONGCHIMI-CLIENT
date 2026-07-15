import { queryOptions } from '@tanstack/react-query';

import { getProductDetail, type GetProductDetailParams } from './api/get-product-detail';
import { getProductList } from './api/get-product-list';
import { getProductSearch } from './api/get-product-search';
import {
  productQueryKeys,
  type ProductListQueryParamsTypes,
  type ProductSearchQueryParamsTypes,
} from './query-keys';

const DEFAULT_PRODUCT_SEARCH_SIZE = 10;

export type { ProductListQueryParamsTypes, ProductSearchQueryParamsTypes } from './query-keys';

export const productSearchQueryOptions = (params: ProductSearchQueryParamsTypes) => {
  const queryParams = {
    keyword: params.keyword.trim(),
    marketId: params.marketId,
    size: params.size ?? DEFAULT_PRODUCT_SEARCH_SIZE,
  };

  return queryOptions({
    enabled: queryParams.keyword.length > 0 && queryParams.marketId != null,
    queryKey: productQueryKeys.search(queryParams),
    queryFn: () => {
      if (queryParams.marketId == null) {
        throw new Error('Product search marketId is required.');
      }

      return getProductSearch({
        keyword: queryParams.keyword,
        marketId: queryParams.marketId,
        size: queryParams.size,
      });
    },
    throwOnError: false,
  });
};

export const productDetailQueryOptions = (params: GetProductDetailParams) => {
  return queryOptions({
    queryKey: productQueryKeys.detail(params),
    queryFn: () => getProductDetail(params),
    throwOnError: false,
  });
};

export const productListQueryOptions = (params: ProductListQueryParamsTypes) => {
  const { marketId, sort = 'CATEGORY', type } = params;
  const queryParams = { marketId, sort, type };

  return queryOptions({
    enabled: marketId != null,
    queryKey: productQueryKeys.list(queryParams),
    queryFn: () => {
      if (marketId == null) {
        throw new Error('Product list marketId is required.');
      }

      return getProductList({ marketId, sort, type });
    },
  });
};
