'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getNearbyMarketMarkers,
  type NearbyMarketsListParamsTypes,
} from '../api/nearby-markets-api';
import { nearbyMarketsQueryKeys } from '../query-keys';

export const useGetNearbyMarketMarkersQuery = (params: NearbyMarketsListParamsTypes = {}) => {
  return useQuery({
    queryKey: nearbyMarketsQueryKeys.markers(params),
    queryFn: () => getNearbyMarketMarkers(params),
    select: (response) => response.contents,
  });
};
