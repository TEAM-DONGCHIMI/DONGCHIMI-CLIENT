import { describe, expect, it } from 'vitest';

import { productQueryKeys } from './query-keys';
import { productDetailQueryOptions, productListQueryOptions } from './query-options';

describe('productQueryKeys', () => {
  it('declares static hierarchical product keys', () => {
    expect(productQueryKeys).toEqual({
      all: ['product'],
      detail: ['product', 'detail'],
      list: ['product', 'list'],
    });
  });

  it('combines detail params in query options', () => {
    expect(productDetailQueryOptions({ marketId: 1, productId: 101 }).queryKey).toEqual([
      'product',
      'detail',
      { marketId: 1, productId: 101 },
    ]);
    expect(productDetailQueryOptions({ marketId: 1, productId: 101 }).queryKey).not.toEqual(
      productDetailQueryOptions({ marketId: 1, productId: 102 }).queryKey,
    );
  });

  it('combines list params in query options', () => {
    const defaultSortKey = productListQueryOptions({ marketId: 1, type: 'DAILY' }).queryKey;

    expect(defaultSortKey).toEqual([
      'product',
      'list',
      {
        marketId: 1,
        sort: 'CATEGORY',
        type: 'DAILY',
      },
    ]);
    expect(defaultSortKey).toEqual(
      productListQueryOptions({ marketId: 1, sort: 'CATEGORY', type: 'DAILY' }).queryKey,
    );
  });

  it('separates cache entries by market, deal type, and sort', () => {
    const dailyKey = productListQueryOptions({
      marketId: 1,
      sort: 'LATEST',
      type: 'DAILY',
    }).queryKey;
    const periodicKey = productListQueryOptions({
      marketId: 1,
      sort: 'LATEST',
      type: 'PERIODIC',
    }).queryKey;
    const anotherSortKey = productListQueryOptions({
      marketId: 1,
      sort: 'VIEW_COUNT',
      type: 'DAILY',
    }).queryKey;

    expect(dailyKey).not.toEqual(periodicKey);
    expect(dailyKey).not.toEqual(anotherSortKey);
  });
});
