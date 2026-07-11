'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getNearbyMarkets, type NearbyMarketsListParamsTypes } from '../api/nearby-markets-api';
import { nearbyMarketsQueryKeys } from '../query-keys';

export const useGetNearbyMarketsInfiniteQuery = (params: NearbyMarketsListParamsTypes = {}) => {
  return useInfiniteQuery({
    queryKey: nearbyMarketsQueryKeys.list(params),
    queryFn: async ({ pageParam }) => {
      const response = await getNearbyMarkets({ ...params, cursor: pageParam });

      return {
        items: response.contents,
        nextCursor: response.nextCursor,
      };
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
