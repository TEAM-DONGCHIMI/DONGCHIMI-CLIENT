import type { GetProductDetailParams } from './api/get-product-detail';
import type { GetProductListParams } from './api/get-product-list';
import type { GetProductSearchParams } from './api/get-product-search';

export type ProductSearchQueryParamsTypes = Omit<GetProductSearchParams, 'marketId'> & {
  marketId?: GetProductSearchParams['marketId'];
};

export type ProductSearchQueryKeyParamsTypes = Omit<ProductSearchQueryParamsTypes, 'size'> & {
  size: NonNullable<GetProductSearchParams['size']>;
};

export type ProductDetailQueryParamsTypes = GetProductDetailParams;

export type ProductListQueryParamsTypes = Omit<GetProductListParams, 'marketId'> & {
  marketId?: GetProductListParams['marketId'];
};

export type ProductListQueryKeyParamsTypes = Omit<ProductListQueryParamsTypes, 'sort'> & {
  sort: NonNullable<GetProductListParams['sort']>;
};

const productAllQueryKey = ['product'] as const;
const productSearchRootQueryKey = [...productAllQueryKey, 'search'] as const;
const productDetailRootQueryKey = [...productAllQueryKey, 'detail'] as const;
const productListRootQueryKey = [...productAllQueryKey, 'list'] as const;

export const productQueryKeys = {
  all: productAllQueryKey,
  searchRoot: productSearchRootQueryKey,
  search: (params: ProductSearchQueryKeyParamsTypes) =>
    [...productSearchRootQueryKey, params] as const,
  detailRoot: productDetailRootQueryKey,
  detail: (params: ProductDetailQueryParamsTypes) =>
    [...productDetailRootQueryKey, params] as const,
  listRoot: productListRootQueryKey,
  listByMarket: (marketId: number) => [...productListRootQueryKey, { marketId }] as const,
  list: (params: ProductListQueryKeyParamsTypes) => [...productListRootQueryKey, params] as const,
} as const;
