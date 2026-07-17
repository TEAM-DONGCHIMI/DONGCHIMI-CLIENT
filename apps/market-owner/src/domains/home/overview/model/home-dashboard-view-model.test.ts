import { describe, expect, it } from 'vitest';

import { ownerHomeFixture } from '@/domains/home/fixtures/owner-home-api.fixture';

import { createHomeDashboardViewModel } from './home-dashboard-view-model';

describe('createHomeDashboardViewModel', () => {
  it('maps owner home response data to the existing product and share card models', () => {
    const viewModel = createHomeDashboardViewModel(ownerHomeFixture);

    expect(viewModel.sections).toEqual([
      expect.objectContaining({
        dealType: 'DAILY',
        id: 'daily',
        itemVariant: 'today',
        totalCount: 1,
        items: [
          expect.objectContaining({
            id: '101',
            priceText: '4,900원',
            originalPriceText: '6,900원',
            discountRate: 29,
          }),
        ],
      }),
      expect.objectContaining({
        dealType: 'PERIODIC',
        id: 'periodic',
        itemVariant: 'period',
        totalCount: 1,
        items: [
          expect.objectContaining({
            id: '102',
            priceText: '2,900원',
            rank: 1,
          }),
        ],
      }),
    ]);
    expect(viewModel.share.displayUrl).toBe('app.dongchiimi.com/markets/mangwon-fresh');
    expect(viewModel.share.copyUrl).toBe('https://app.dongchiimi.com/markets/mangwon-fresh');
  });

  it('keeps the flyer empty state when the API returns no flyer', () => {
    const viewModel = createHomeDashboardViewModel({
      ...ownerHomeFixture,
      flyer: null,
    });

    expect(viewModel.share.flyer).toBeNull();
    expect(viewModel.share.displayUrl).toBe('');
    expect(viewModel.share.copyUrl).toBe('');
  });
});
