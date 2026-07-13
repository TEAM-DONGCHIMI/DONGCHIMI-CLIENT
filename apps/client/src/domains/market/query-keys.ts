import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';
import type { MarketDetailParamsTypes } from './api/market-detail-api';

export const nearbyMarketsQueryKeys = {
  all: ['market', 'nearby-markets'] as const,
  list: (params: NearbyMarketsListParamsTypes) => [...nearbyMarketsQueryKeys.all, params] as const,
  markers: (params: NearbyMarketsListParamsTypes) =>
    [...nearbyMarketsQueryKeys.all, 'markers', params] as const,
};

export const marketDetailQueryKeys = {
  all: ['market', 'market-detail'] as const,
  query: (params: MarketDetailParamsTypes) => [...marketDetailQueryKeys.all, params] as const,
};
