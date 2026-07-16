import { describe, expect, it } from 'vitest';

import { productQueryKeys } from './query-keys';
import {
  getProductListNextPageParam,
  preparedProductDraftsQueryOptions,
  productDetailQueryOptions,
  productListInfiniteQueryOptions,
  productSearchQueryOptions,
} from './query-options';

describe('productQueryKeys', () => {
  it('declares root keys and key factories', () => {
    expect(productQueryKeys.all).toEqual(['product']);
    expect(productQueryKeys.searchRoot).toEqual(['product', 'search']);
    expect(productQueryKeys.detailRoot).toEqual(['product', 'detail']);
    expect(productQueryKeys.listRoot).toEqual(['product', 'list']);
    expect(productQueryKeys.preparedDraftsRoot).toEqual(['product', 'prepared-drafts']);
    expect(
      productQueryKeys.search({
        keyword: '풀무원',
        marketId: 1,
        size: 10,
      }),
    ).toEqual([
      'product',
      'search',
      {
        keyword: '풀무원',
        marketId: 1,
        size: 10,
      },
    ]);
    expect(productQueryKeys.detail({ marketId: 1, productId: 101 })).toEqual([
      'product',
      'detail',
      { marketId: 1, productId: 101 },
    ]);
    expect(
      productQueryKeys.list({ marketId: 1, size: 12, sort: 'CATEGORY', type: 'DAILY' }),
    ).toEqual(['product', 'list', { marketId: 1, size: 12, sort: 'CATEGORY', type: 'DAILY' }]);
    expect(productQueryKeys.listByMarket(1)).toEqual(['product', 'list', { marketId: 1 }]);
    expect(
      productQueryKeys.preparedDrafts({
        categories: ['SEAFOOD'],
        fetchAll: true,
        marketId: 1,
        page: 0,
        search: '고등어',
        size: 10,
      }),
    ).toEqual([
      'product',
      'prepared-drafts',
      {
        categories: ['SEAFOOD'],
        fetchAll: true,
        marketId: 1,
        page: 0,
        search: '고등어',
        size: 10,
      },
    ]);
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
    const defaultSortKey = productListInfiniteQueryOptions({
      marketId: 1,
      type: 'DAILY',
    }).queryKey;

    expect(defaultSortKey).toEqual([
      'product',
      'list',
      {
        marketId: 1,
        size: 12,
        sort: 'CATEGORY',
        type: 'DAILY',
      },
    ]);
    expect(defaultSortKey).toEqual(
      productListInfiniteQueryOptions({
        marketId: 1,
        size: 12,
        sort: 'CATEGORY',
        type: 'DAILY',
      }).queryKey,
    );
  });

  it('disables product list without a market id', () => {
    expect(productListInfiniteQueryOptions({ marketId: undefined, type: 'DAILY' }).enabled).toBe(
      false,
    );
  });

  it('separates cache entries by market, deal type, and sort', () => {
    const dailyKey = productListInfiniteQueryOptions({
      marketId: 1,
      sort: 'LATEST',
      type: 'DAILY',
    }).queryKey;
    const periodicKey = productListInfiniteQueryOptions({
      marketId: 1,
      sort: 'LATEST',
      type: 'PERIODIC',
    }).queryKey;
    const anotherSortKey = productListInfiniteQueryOptions({
      marketId: 1,
      sort: 'VIEW_COUNT',
      type: 'DAILY',
    }).queryKey;

    expect(dailyKey).not.toEqual(periodicKey);
    expect(dailyKey).not.toEqual(anotherSortKey);
    expect(dailyKey).not.toEqual(
      productListInfiniteQueryOptions({
        marketId: 1,
        size: 24,
        sort: 'LATEST',
        type: 'DAILY',
      }).queryKey,
    );
  });

  it('uses the server nextCursor once and stops when there is no next page', () => {
    const nextPage = {
      code: 'SUCCESS',
      data: { content: [], hasNext: true, nextCursor: 101 },
      message: '요청에 성공했습니다.',
      success: true,
    };
    const lastPage = {
      ...nextPage,
      data: { content: [], hasNext: false, nextCursor: null },
    };

    expect(getProductListNextPageParam(nextPage, [], undefined, [undefined])).toBe(101);
    expect(getProductListNextPageParam(nextPage, [], 101, [undefined, 101])).toBeUndefined();
    expect(getProductListNextPageParam(lastPage, [], 101, [undefined, 101])).toBeUndefined();
  });

  it('combines normalized prepared draft params in query options', () => {
    const queryKey = preparedProductDraftsQueryOptions({
      categories: ['MEAT_EGG'],
      marketId: 1,
      page: 2,
      search: '  삼겹살  ',
      size: 20,
    }).queryKey;

    expect(queryKey).toEqual([
      'product',
      'prepared-drafts',
      {
        categories: ['MEAT_EGG'],
        fetchAll: false,
        marketId: 1,
        page: 2,
        search: '삼겹살',
        size: 20,
      },
    ]);
  });

  it('uses default prepared draft page and size and disables without a market id', () => {
    expect(preparedProductDraftsQueryOptions({ marketId: 1 }).queryKey).toEqual([
      'product',
      'prepared-drafts',
      {
        categories: [],
        fetchAll: false,
        marketId: 1,
        page: 0,
        search: '',
        size: 10,
      },
    ]);
    expect(preparedProductDraftsQueryOptions({ marketId: undefined }).enabled).toBe(false);
  });
});
