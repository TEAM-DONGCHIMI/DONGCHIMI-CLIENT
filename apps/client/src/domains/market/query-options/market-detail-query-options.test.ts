import { describe, expect, it } from 'vitest';

import { marketDetailQueryOptions } from './market-detail-query-options';

describe('marketDetailQueryOptions', () => {
  it('마트 상세 query key와 query function을 같은 option으로 묶는다', () => {
    const options = marketDetailQueryOptions({ slug: 'mangwon-fresh' });

    expect(options.queryKey).toEqual([
      'market',
      'market-detail',
      {
        slug: 'mangwon-fresh',
      },
    ]);
    expect(options.queryFn).toEqual(expect.any(Function));
  });
});
