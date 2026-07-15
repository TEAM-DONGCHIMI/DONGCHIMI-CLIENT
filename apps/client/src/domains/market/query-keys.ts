import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';
import type { MarketDetailParamsTypes } from './api/market-detail-api';

const normalizeNearbyMarketsListParams = ({
  lat,
  lng,
  radius,
  size,
}: NearbyMarketsListParamsTypes) => {
  return Object.fromEntries(
    Object.entries({
      lat,
      lng,
      radius,
      size,
    }).filter(([, value]) => value !== undefined),
  );
};

export const marketQueryKeys = {
  all: ['market'] as const,
  detail: (params: MarketDetailParamsTypes) =>
    [...marketQueryKeys.all, 'market-detail', params] as const,
  nearbyList: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', normalizeNearbyMarketsListParams(params)] as const,
  nearbyMarkers: (params: NearbyMarketsListParamsTypes) =>
    [
      ...marketQueryKeys.all,
      'nearby-markets',
      'markers',
      normalizeNearbyMarketsListParams(params),
    ] as const,
};
