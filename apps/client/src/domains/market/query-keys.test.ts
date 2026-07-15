import { describe, expect, it } from 'vitest';

import { marketQueryKeys } from './query-keys';

describe('marketQueryKeys.periodicProducts', () => {
  it('응답을 바꾸는 marketId, category, size를 포함한다', () => {
    expect(
      marketQueryKeys.periodicProducts({
        category: 'MEAT_EGG',
        marketId: 1,
        size: 20,
      }),
    ).toEqual(['market', 'products', 'periodic', { category: 'MEAT_EGG', marketId: 1, size: 20 }]);
  });

  it('size를 생략하면 API 기본값 12로 정규화한다', () => {
    expect(marketQueryKeys.periodicProducts({ marketId: 1 })).toEqual([
      'market',
      'products',
      'periodic',
      { category: undefined, marketId: 1, size: 12 },
    ]);
  });
});
