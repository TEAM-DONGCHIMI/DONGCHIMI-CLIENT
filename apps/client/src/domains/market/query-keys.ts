import type { MarketDetailParamsTypes } from './api/market-detail-api';
import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';
import type { PeriodicProductsListParamsTypes } from './api/periodic-products-api';
import { DEFAULT_PERIODIC_PRODUCTS_PAGE_SIZE } from './model/periodic-products-schema';

const normalizePeriodicProductsParams = ({
  category,
  marketId,
  size = DEFAULT_PERIODIC_PRODUCTS_PAGE_SIZE,
}: PeriodicProductsListParamsTypes) => ({
  category,
  marketId,
  size,
});

export const marketQueryKeys = {
  all: ['market'] as const,
  detail: (params: MarketDetailParamsTypes) =>
    [...marketQueryKeys.all, 'market-detail', params] as const,
  nearbyList: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', params] as const,
  nearbyMarkers: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', 'markers', params] as const,
  products: () => [...marketQueryKeys.all, 'products'] as const,
  periodicProducts: (params: PeriodicProductsListParamsTypes) =>
    [...marketQueryKeys.products(), 'periodic', normalizePeriodicProductsParams(params)] as const,
};
