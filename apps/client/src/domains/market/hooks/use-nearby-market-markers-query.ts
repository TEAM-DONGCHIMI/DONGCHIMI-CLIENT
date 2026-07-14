'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getNearbyMarketMarkers,
  type NearbyMarketsListParamsTypes,
} from '../api/nearby-markets-api';
import { hasNearbyMarketsLocationParams } from './nearby-markets-location-params';
import { nearbyMarketsQueryKeys } from '../query-keys';

export const useGetNearbyMarketMarkersQuery = (params: NearbyMarketsListParamsTypes = {}) => {
  return useQuery({
    queryKey: nearbyMarketsQueryKeys.markers(params),
    queryFn: () => {
      if (!hasNearbyMarketsLocationParams(params)) {
        throw new Error('Nearby market markers query requires location params.');
      }

      return getNearbyMarketMarkers(params);
    },
    select: (response) => response.contents,
    enabled: hasNearbyMarketsLocationParams(params),
  });
};
