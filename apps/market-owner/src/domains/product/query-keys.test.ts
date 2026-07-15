import { describe, expect, it } from 'vitest';

import { productQueryKeys } from './query-keys';
import {
  productDetailQueryOptions,
  productListQueryOptions,
  productSearchQueryOptions,
} from './query-options';

describe('productQueryKeys', () => {
  it('declares static hierarchical product keys', () => {
    expect(productQueryKeys).toEqual({
      all: ['product'],
      search: ['product', 'search'],
      detail: ['product', 'detail'],
      list: ['product', 'list'],
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
