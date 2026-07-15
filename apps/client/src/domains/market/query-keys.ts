import type { MarketDetailParamsTypes } from './api/market-detail-api';
import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';
import type { ProductDetailParamsTypes } from './api/product-detail-api';

const normalizeProductDetailParams = ({ marketId, productId }: ProductDetailParamsTypes) => {
  return {
    marketId,
    productId,
  } satisfies ProductDetailParamsTypes;
};

export const marketQueryKeys = {
  all: ['market'] as const,
  detail: (params: MarketDetailParamsTypes) =>
    [...marketQueryKeys.all, 'market-detail', params] as const,
  nearbyList: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', params] as const,
  nearbyMarkers: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', 'markers', params] as const,
  productDetailRoot: () => [...marketQueryKeys.all, 'products', 'detail'] as const,
  productDetail: (params: ProductDetailParamsTypes) =>
    [...marketQueryKeys.productDetailRoot(), normalizeProductDetailParams(params)] as const,
};
