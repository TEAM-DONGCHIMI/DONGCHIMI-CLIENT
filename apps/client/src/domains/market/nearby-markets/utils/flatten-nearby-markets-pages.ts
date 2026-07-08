import type { InfiniteData } from '@tanstack/react-query';

import type { CursorPageTypes } from '@/shared/utils';

import type { NearbyMarketTypes } from '../../model/nearby-market';

export const flattenNearbyMarketsPages = (
  data: InfiniteData<CursorPageTypes<NearbyMarketTypes>> | undefined,
): NearbyMarketTypes[] => {
  return data?.pages.flatMap((page) => page.items) ?? [];
};
