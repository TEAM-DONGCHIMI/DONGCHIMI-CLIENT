import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';
import type { PeriodicProductsListParamsTypes } from './api/periodic-products-api';
import { DEFAULT_PERIODIC_PRODUCTS_PAGE_SIZE } from './model/periodic-products-schema';

export const nearbyMarketsQueryKeys = {
  all: ['market', 'nearby-markets'] as const,
  list: (params: NearbyMarketsListParamsTypes) => [...nearbyMarketsQueryKeys.all, params] as const,
  markers: (params: NearbyMarketsListParamsTypes) =>
    [...nearbyMarketsQueryKeys.all, 'markers', params] as const,
};

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
  products: () => [...marketQueryKeys.all, 'products'] as const,
  periodicProducts: (params: PeriodicProductsListParamsTypes) =>
    [...marketQueryKeys.products(), 'periodic', normalizePeriodicProductsParams(params)] as const,
};
