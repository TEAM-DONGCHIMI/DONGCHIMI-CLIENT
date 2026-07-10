import { describe, expect, it } from 'vitest';

import { productDetailQueryOptions } from './product-detail-query-options';

describe('productDetailQueryOptions', () => {
  it('상품 상세 query key와 query function을 같은 option으로 묶는다', () => {
    const options = productDetailQueryOptions({ marketId: '1', productId: '10' });

    expect(options.queryKey).toEqual([
      'market',
      'products',
      'detail',
      {
        marketId: '1',
        productId: '10',
      },
    ]);
    expect(options.queryFn).toEqual(expect.any(Function));
  });
});
