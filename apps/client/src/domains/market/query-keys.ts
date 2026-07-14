import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';
import type { MarketDetailParamsTypes } from './api/market-detail-api';

export const marketQueryKeys = {
  all: ['market'] as const,
  detail: (params: MarketDetailParamsTypes) =>
    [...marketQueryKeys.all, 'market-detail', params] as const,
  nearbyList: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', params] as const,
  nearbyMarkers: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', 'markers', params] as const,
};
