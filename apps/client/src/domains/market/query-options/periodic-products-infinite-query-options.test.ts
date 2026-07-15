import { describe, expect, it } from 'vitest';

import { getPeriodicProductsNextPageParam } from './periodic-products-infinite-query-options';

describe('getPeriodicProductsNextPageParam', () => {
  it('다음 페이지가 있으면 nextCursor를 반환한다', () => {
    expect(getPeriodicProductsNextPageParam({ content: [], hasNext: true, nextCursor: 301 })).toBe(
      301,
    );
  });

  it('hasNext가 false이면 cursor가 있어도 요청을 종료한다', () => {
    expect(
      getPeriodicProductsNextPageParam({ content: [], hasNext: false, nextCursor: 301 }),
    ).toBeUndefined();
  });

  it('nextCursor가 null이면 요청을 종료한다', () => {
    expect(
      getPeriodicProductsNextPageParam({ content: [], hasNext: true, nextCursor: null }),
    ).toBeUndefined();
  });
});
