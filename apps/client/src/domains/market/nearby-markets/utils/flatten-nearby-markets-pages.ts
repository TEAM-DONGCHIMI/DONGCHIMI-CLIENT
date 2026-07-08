import type { InfiniteData } from '@tanstack/react-query';

import type { NearbyMarketsResponseTypes } from '../../api/nearby-markets-api';
import type { NearbyMarketTypes } from '../../model/nearby-market';

export const flattenNearbyMarketsPages = (
  data: InfiniteData<NearbyMarketsResponseTypes> | undefined,
): NearbyMarketTypes[] => {
  return data?.pages.flatMap((page) => page.items) ?? [];
};
