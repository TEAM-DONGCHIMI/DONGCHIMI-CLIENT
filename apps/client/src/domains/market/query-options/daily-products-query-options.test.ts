import { describe, expect, it } from 'vitest';

import { dailyProductsQueryOptions } from './daily-products-query-options';

describe('dailyProductsQueryOptions', () => {
  it('marketId를 포함한 query key와 query function을 묶는다', () => {
    const options = dailyProductsQueryOptions({ marketId: 2 });

    expect(options.queryKey).toEqual(['market', 'products', 'daily', { marketId: 2 }]);
    expect(options.queryFn).toEqual(expect.any(Function));
  });
});
