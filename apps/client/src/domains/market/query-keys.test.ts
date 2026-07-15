import { describe, expect, it } from 'vitest';

import { dailyProductsQueryKeys } from './query-keys';

describe('dailyProductsQueryKeys', () => {
  it('응답을 바꾸는 marketId를 cache key에 포함한다', () => {
    expect(dailyProductsQueryKeys.query({ marketId: 2 })).toEqual([
      'market',
      'daily-products',
      { marketId: 2 },
    ]);
    expect(dailyProductsQueryKeys.query({ marketId: 3 })).not.toEqual(
      dailyProductsQueryKeys.query({ marketId: 2 }),
    );
  });
});
