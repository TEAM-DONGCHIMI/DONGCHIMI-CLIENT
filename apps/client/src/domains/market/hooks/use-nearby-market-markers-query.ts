'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getNearbyMarketMarkers,
  type NearbyMarketsListParamsTypes,
} from '../api/nearby-markets-api';
import { marketQueryKeys } from '../query-keys';

export const useGetNearbyMarketMarkersQuery = (params: NearbyMarketsListParamsTypes = {}) => {
  return useQuery({
    queryKey: marketQueryKeys.nearbyMarkers(params),
    queryFn: () => getNearbyMarketMarkers(params),
    select: (response) => response.contents,
  });
};
