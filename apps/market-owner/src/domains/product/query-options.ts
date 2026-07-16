import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { getProductDetail, type GetProductDetailParams } from './api/get-product-detail';
import { getProductList } from './api/get-product-list';
import { getProductSearch } from './api/get-product-search';
import {
  getAllPreparedProductDrafts,
  getPreparedProductDrafts,
} from './api/get-prepared-product-drafts';
import {
  productQueryKeys,
  type PreparedProductDraftsQueryParamsTypes,
  type ProductListQueryParamsTypes,
  type ProductSearchQueryParamsTypes,
} from './query-keys';

const DEFAULT_PRODUCT_SEARCH_SIZE = 10;
const DEFAULT_PRODUCT_LIST_SIZE = 12;
const DEFAULT_PREPARED_PRODUCT_DRAFT_PAGE = 0;
const DEFAULT_PREPARED_PRODUCT_DRAFT_SIZE = 10;

export type {
  PreparedProductDraftsQueryParamsTypes,
  ProductListQueryParamsTypes,
  ProductSearchQueryParamsTypes,
} from './query-keys';

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

export const getProductListNextPageParam = (
  lastPage: Awaited<ReturnType<typeof getProductList>>,
  _allPages: Awaited<ReturnType<typeof getProductList>>[],
  _lastPageParam: number | undefined,
  allPageParams: (number | undefined)[],
) => {
  const pagination = lastPage.data;

  if (!pagination?.hasNext || pagination.nextCursor == null) {
    return undefined;
  }

  if (allPageParams.includes(pagination.nextCursor)) {
    return undefined;
  }

  return pagination.nextCursor;
};

export const productListInfiniteQueryOptions = (params: ProductListQueryParamsTypes) => {
  const { marketId, size = DEFAULT_PRODUCT_LIST_SIZE, sort = 'CATEGORY', type } = params;
  const queryParams = { marketId, size, sort, type };

  return infiniteQueryOptions({
    enabled: marketId != null,
    getNextPageParam: getProductListNextPageParam,
    initialPageParam: undefined as number | undefined,
    queryKey: productQueryKeys.list(queryParams),
    queryFn: ({ pageParam }) => {
      if (marketId == null) {
        throw new Error('Product list marketId is required.');
      }

      return getProductList({ cursor: pageParam, marketId, size, sort, type });
    },
  });
};

export const preparedProductDraftsQueryOptions = (
  params: PreparedProductDraftsQueryParamsTypes,
) => {
  const queryParams = {
    categories: params.categories ?? [],
    fetchAll: params.fetchAll ?? false,
    marketId: params.marketId,
    page: params.page ?? DEFAULT_PREPARED_PRODUCT_DRAFT_PAGE,
    search: params.search?.trim() ?? '',
    size: params.size ?? DEFAULT_PREPARED_PRODUCT_DRAFT_SIZE,
  };

  return queryOptions({
    enabled: queryParams.marketId != null,
    queryKey: productQueryKeys.preparedDrafts(queryParams),
    queryFn: () => {
      if (queryParams.marketId == null) {
        throw new Error('Prepared product drafts marketId is required.');
      }

      const queryFn = queryParams.fetchAll ? getAllPreparedProductDrafts : getPreparedProductDrafts;

      return queryFn({
        categories: queryParams.categories,
        marketId: queryParams.marketId,
        page: queryParams.page,
        search: queryParams.search,
        size: queryParams.size,
      });
    },
    throwOnError: false,
  });
};
