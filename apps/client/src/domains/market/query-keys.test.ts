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
});
