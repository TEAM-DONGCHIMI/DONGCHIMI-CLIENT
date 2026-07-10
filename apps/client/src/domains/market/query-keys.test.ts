import { describe, expect, it } from 'vitest';

import { productDetailQueryKeys } from './query-keys';

describe('productDetailQueryKeys', () => {
  it('상품 상세 응답을 바꾸는 marketId와 productId를 detail query key에 포함한다', () => {
    expect(productDetailQueryKeys.detail({ marketId: '1', productId: '10' })).toEqual([
      'market',
      'products',
      'detail',
      {
        marketId: '1',
        productId: '10',
      },
    ]);
  });
});
