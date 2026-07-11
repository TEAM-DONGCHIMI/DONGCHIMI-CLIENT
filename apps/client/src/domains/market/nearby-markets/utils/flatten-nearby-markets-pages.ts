import type { InfiniteData } from '@tanstack/react-query';

import type { CursorPageTypes } from '@/shared/utils';

import type { NearbyMarketDtoTypes } from '../../model/nearby-markets-schema';

export const flattenNearbyMarketsPages = (
  data: InfiniteData<CursorPageTypes<NearbyMarketDtoTypes>> | undefined,
): NearbyMarketDtoTypes[] => {
  return data?.pages.flatMap((page) => page.items) ?? [];
};
