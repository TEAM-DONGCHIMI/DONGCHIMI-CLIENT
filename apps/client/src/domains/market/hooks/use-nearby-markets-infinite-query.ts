'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getNearbyMarkets, type NearbyMarketsListParamsTypes } from '../api/nearby-markets-api';
import { nearbyMarketsQueryKeys } from '../query-keys';

export const useNearbyMarketsInfiniteQuery = (params: NearbyMarketsListParamsTypes = {}) => {
  return useInfiniteQuery({
    queryKey: nearbyMarketsQueryKeys.list(params),
    queryFn: ({ pageParam }) => getNearbyMarkets({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
