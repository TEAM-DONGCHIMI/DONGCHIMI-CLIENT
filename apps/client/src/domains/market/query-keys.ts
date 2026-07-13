import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';

const normalizeNearbyMarketsListParams = ({
  lat,
  lng,
  radius,
  size,
}: NearbyMarketsListParamsTypes) => ({
  lat,
  lng,
  radius,
  size,
});

export const nearbyMarketsQueryKeys = {
  all: ['market', 'nearby-markets'] as const,
  list: (params: NearbyMarketsListParamsTypes) =>
    [...nearbyMarketsQueryKeys.all, normalizeNearbyMarketsListParams(params)] as const,
  markers: (params: NearbyMarketsListParamsTypes) =>
    [...nearbyMarketsQueryKeys.all, 'markers', normalizeNearbyMarketsListParams(params)] as const,
};
