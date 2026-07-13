'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getNearbyMarketMarkers,
  type NearbyMarketsListParamsTypes,
} from '../api/nearby-markets-api';
import { nearbyMarketsQueryKeys } from '../query-keys';

const hasNearbyMarketsLocationParams = ({ lat, lng }: NearbyMarketsListParamsTypes) => {
  return typeof lat === 'number' && typeof lng === 'number';
};

export const useGetNearbyMarketMarkersQuery = (params: NearbyMarketsListParamsTypes = {}) => {
  return useQuery({
    queryKey: nearbyMarketsQueryKeys.markers(params),
    queryFn: () => getNearbyMarketMarkers(params),
    select: (response) => response.contents,
    enabled: hasNearbyMarketsLocationParams(params),
  });
};
