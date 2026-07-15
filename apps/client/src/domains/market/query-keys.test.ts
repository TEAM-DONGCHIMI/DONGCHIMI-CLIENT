import { describe, expect, it } from 'vitest';

import { marketQueryKeys } from './query-keys';

describe('marketQueryKeys', () => {
  it('마트 상세, 위치 기준 마트, 상품 조회 key를 market 도메인 아래에 둔다', () => {
    expect(marketQueryKeys.detail({ slug: 'mangwon-fresh' })).toEqual([
      'market',
      'market-detail',
      { slug: 'mangwon-fresh' },
    ]);
    expect(marketQueryKeys.nearbyList({ lat: 37.556, lng: 126.91 })).toEqual([
      'market',
      'nearby-markets',
      { lat: 37.556, lng: 126.91 },
    ]);
    expect(marketQueryKeys.nearbyMarkers({ lat: 37.556, lng: 126.91 })).toEqual([
      'market',
      'nearby-markets',
      'markers',
      { lat: 37.556, lng: 126.91 },
    ]);
    expect(marketQueryKeys.dailyProducts({ marketId: 2 })).toEqual([
      'market',
      'products',
      'daily',
      { marketId: 2 },
    ]);
  });

  it('오늘의 특가 응답을 바꾸는 marketId를 cache key에 포함한다', () => {
    expect(marketQueryKeys.dailyProducts({ marketId: 3 })).not.toEqual(
      marketQueryKeys.dailyProducts({ marketId: 2 }),
    );
  });

  it('행사 상품의 기본 size를 정규화해 같은 query key를 만든다', () => {
    expect(marketQueryKeys.periodicProducts({ marketId: 1 })).toEqual(
      marketQueryKeys.periodicProducts({ marketId: 1, size: 12 }),
    );
  });

  it('행사 상품 category와 marketId를 query key에서 구분한다', () => {
    expect(marketQueryKeys.periodicProducts({ category: 'MEAT_EGG', marketId: 1 })).not.toEqual(
      marketQueryKeys.periodicProducts({ category: 'SEAFOOD', marketId: 1 }),
    );
    expect(marketQueryKeys.periodicProducts({ marketId: 1 })).not.toEqual(
      marketQueryKeys.periodicProducts({ marketId: 2 }),
    );
  });

  it('상품 상세 응답을 바꾸는 marketId와 productId를 key에 포함한다', () => {
    expect(marketQueryKeys.productDetail({ marketId: 1, productId: '10' })).toEqual([
      'market',
      'products',
      'detail',
      {
        marketId: 1,
        productId: '10',
      },
    ]);
  });
});
