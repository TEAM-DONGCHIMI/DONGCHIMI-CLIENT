import { describe, expect, it } from 'vitest';

import { productQueryKeys } from './query-keys';
import { productSearchQueryOptions } from './query-options';

describe('productQueryKeys', () => {
  it('declares static hierarchical product keys', () => {
    expect(productQueryKeys).toEqual({
      all: ['product'],
      search: ['product', 'search'],
    });
  });

  it('combines normalized search params in query options', () => {
    const defaultSizeKey = productSearchQueryOptions({
      keyword: '  풀무원  ',
      marketId: 1,
    }).queryKey;

    expect(defaultSizeKey).toEqual([
      'product',
      'search',
      {
        keyword: '풀무원',
        marketId: 1,
        size: 10,
      },
    ]);
    expect(defaultSizeKey).toEqual(
      productSearchQueryOptions({ keyword: '풀무원', marketId: 1, size: 10 }).queryKey,
    );
  });

  it('separates cache entries by market, keyword, and size', () => {
    const baseKey = productSearchQueryOptions({ keyword: '풀', marketId: 1, size: 10 }).queryKey;

    expect(baseKey).not.toEqual(
      productSearchQueryOptions({ keyword: '풀', marketId: 2, size: 10 }).queryKey,
    );
    expect(baseKey).not.toEqual(
      productSearchQueryOptions({ keyword: '감자', marketId: 1, size: 10 }).queryKey,
    );
    expect(baseKey).not.toEqual(
      productSearchQueryOptions({ keyword: '풀', marketId: 1, size: 5 }).queryKey,
    );
  });

  it('disables a blank search keyword', () => {
    expect(productSearchQueryOptions({ keyword: '   ', marketId: 1 }).enabled).toBe(false);
  });
});
