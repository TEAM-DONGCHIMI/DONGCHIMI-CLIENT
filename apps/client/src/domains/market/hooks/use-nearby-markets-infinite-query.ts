'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getNearbyMarkets, type NearbyMarketsListParamsTypes } from '../api/nearby-markets-api';
import { hasNearbyMarketsLocationParams } from './nearby-markets-location-params';
import { nearbyMarketsQueryKeys } from '../query-keys';

export const useGetNearbyMarketsInfiniteQuery = (params: NearbyMarketsListParamsTypes = {}) => {
  return useInfiniteQuery({
    queryKey: nearbyMarketsQueryKeys.list(params),
    queryFn: async ({ pageParam }) => {
      if (!hasNearbyMarketsLocationParams(params)) {
        throw new Error('Nearby markets query requires location params.');
      }

      const response = await getNearbyMarkets({ ...params, cursor: pageParam });

      return {
        items: response.contents,
        nextCursor: response.nextCursor,
      };
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: hasNearbyMarketsLocationParams(params),
  });
};
