import { describe, expect, it, vi } from 'vitest';

import { marketQueryKeys } from '../query-keys';

import { ownerMarketDetailQueryOptions } from './owner-market-detail-query-options';

vi.mock('../api/get-owner-market-detail', () => ({
  getOwnerMarketDetail: vi.fn(),
}));

describe('ownerMarketDetailQueryOptions', () => {
  it('marketId를 query key에 포함한다', () => {
    expect(ownerMarketDetailQueryOptions({ marketId: 10 }).queryKey).toEqual(
      marketQueryKeys.detail(10),
    );
    expect(ownerMarketDetailQueryOptions({ marketId: 10 }).queryKey).not.toEqual(
      ownerMarketDetailQueryOptions({ marketId: 11 }).queryKey,
    );
  });

  it('marketId가 없으면 query를 비활성화한다', () => {
    expect(ownerMarketDetailQueryOptions({ marketId: undefined }).enabled).toBe(false);
  });
});
