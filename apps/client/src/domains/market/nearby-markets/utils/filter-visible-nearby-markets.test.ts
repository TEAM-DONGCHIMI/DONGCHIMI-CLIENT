import { describe, expect, it } from 'vitest';

import type { NearbyMarketDtoTypes } from '../../model/nearby-markets-schema';
import {
  filterVisibleNearbyMarkets,
  getPrioritizedVisibleNearbyMarkets,
} from './filter-visible-nearby-markets';

const createNearbyMarket = (
  overrides: Partial<NearbyMarketDtoTypes> & Pick<NearbyMarketDtoTypes, 'marketId' | 'isOpen'>,
): NearbyMarketDtoTypes => ({
  address: '서울특별시 마포구 망원동',
  distance: '',
  latitude: 37.556,
  longitude: 126.9,
  name: `테스트 마트 ${overrides.marketId}`,
  previewProducts: [],
  productCount: 1,
  slug: `test-market-${overrides.marketId}`,
  thumbnailUrl: null,
  ...overrides,
});

describe('filterVisibleNearbyMarkets', () => {
  it('등록된 상품이 있는 마트만 노출한다', () => {
    const markets = [
      createNearbyMarket({ isOpen: true, marketId: 1, productCount: 0 }),
      createNearbyMarket({ isOpen: true, marketId: 2, productCount: 3 }),
    ];

    expect(filterVisibleNearbyMarkets(markets).map((market) => market.marketId)).toEqual([2]);
  });
});

describe('getPrioritizedVisibleNearbyMarkets', () => {
  it('등록된 상품이 있는 마트 중 영업중 마트를 먼저 노출하고 같은 영업 상태에서는 조회 순서를 유지한다', () => {
    const markets = [
      createNearbyMarket({ isOpen: false, marketId: 1, productCount: 2 }),
      createNearbyMarket({ isOpen: true, marketId: 2, productCount: 0 }),
      createNearbyMarket({ isOpen: true, marketId: 3, productCount: 5 }),
      createNearbyMarket({ isOpen: false, marketId: 4, productCount: 1 }),
      createNearbyMarket({ isOpen: true, marketId: 5, productCount: 2 }),
    ];

    expect(getPrioritizedVisibleNearbyMarkets(markets).map((market) => market.marketId)).toEqual([
      3, 5, 1, 4,
    ]);
  });
});
