import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';

export const nearbyMarketsQueryKeys = {
  all: ['market', 'nearby-markets'] as const,
  list: (params: NearbyMarketsListParamsTypes) => [...nearbyMarketsQueryKeys.all, params] as const,
};
