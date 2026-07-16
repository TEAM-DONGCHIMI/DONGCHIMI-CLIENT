import { describe, expect, it } from 'vitest';

import {
  getPeriodicProductsNextPageParam,
  PERIODIC_PRODUCTS_INACTIVE_CACHE_TIME_MS,
  periodicProductsInfiniteQueryOptions,
} from './periodic-products-infinite-query-options';

type NextPageTypes = Parameters<typeof getPeriodicProductsNextPageParam>[0];

const resolveNextPageParam = (
  lastPage: NextPageTypes,
  allPageParams: (number | undefined)[] = [undefined],
) => {
  return getPeriodicProductsNextPageParam(
    lastPage,
    [lastPage],
    allPageParams.at(-1),
    allPageParams,
  );
};

describe('getPeriodicProductsNextPageParam', () => {
  it('다음 페이지가 있으면 nextCursor를 반환한다', () => {
    expect(
      resolveNextPageParam({
        availableCategories: [],
        content: [],
        hasNext: true,
        nextCursor: 301,
      }),
    ).toBe(301);
  });

  it('hasNext가 false이면 cursor가 있어도 요청을 종료한다', () => {
    expect(
      resolveNextPageParam({
        availableCategories: [],
        content: [],
        hasNext: false,
        nextCursor: 301,
      }),
    ).toBeUndefined();
  });

  it('nextCursor가 null이면 요청을 종료한다', () => {
    expect(
      resolveNextPageParam({
        availableCategories: [],
        content: [],
        hasNext: true,
        nextCursor: null,
      }),
    ).toBeUndefined();
  });

  it('이미 사용한 nextCursor를 다시 받으면 요청을 종료한다', () => {
    expect(
      resolveNextPageParam(
        {
          availableCategories: [],
          content: [],
          hasNext: true,
          nextCursor: 301,
        },
        [undefined, 301],
      ),
    ).toBeUndefined();
  });
});

describe('periodicProductsInfiniteQueryOptions', () => {
  it('상품 상세 탐색 중 무한 목록 cache를 30분 유지한다', () => {
    expect(periodicProductsInfiniteQueryOptions({ marketId: 1 }).gcTime).toBe(
      PERIODIC_PRODUCTS_INACTIVE_CACHE_TIME_MS,
    );
    expect(PERIODIC_PRODUCTS_INACTIVE_CACHE_TIME_MS).toBe(30 * 60 * 1000);
  });
});
