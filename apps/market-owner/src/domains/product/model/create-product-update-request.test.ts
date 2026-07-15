import { describe, expect, it } from 'vitest';

import { createProductUpdateRequest } from './create-product-update-request';

const formValues = {
  categoryName: '정육/달걀' as const,
  endDate: '2026-06-30',
  originalPrice: '22,000',
  productName: '  삼겹살 500g  ',
  promotionText: '  오늘 입고된 신선한 삼겹살  ',
  salePrice: '19,500',
  startDate: '2026-06-30',
};

describe('createProductUpdateRequest', () => {
  it('creates a daily request with the original price', () => {
    expect(
      createProductUpdateRequest({
        dealType: 'DAILY',
        thumbnailUrl: 'https://cdn.dongchimi.kr/products/201.png',
        values: formValues,
      }),
    ).toEqual({
      type: 'DAILY',
      thumbnailUrl: 'https://cdn.dongchimi.kr/products/201.png',
      name: '삼겹살 500g',
      category: 'MEAT_EGG',
      promotionalPhrase: '오늘 입고된 신선한 삼겹살',
      originalPrice: 22000,
      discountedPrice: 19500,
      discountStartDate: '2026-06-30',
      discountEndDate: '2026-06-30',
    });
  });

  it('creates a periodic request without the original price and normalizes an empty promotion', () => {
    expect(
      createProductUpdateRequest({
        dealType: 'PERIODIC',
        thumbnailUrl: null,
        values: {
          ...formValues,
          endDate: '2026-07-02',
          promotionText: '   ',
          salePrice: '6,900',
        },
      }),
    ).toEqual({
      type: 'PERIODIC',
      thumbnailUrl: null,
      name: '삼겹살 500g',
      category: 'MEAT_EGG',
      promotionalPhrase: null,
      discountedPrice: 6900,
      discountStartDate: '2026-06-30',
      discountEndDate: '2026-07-02',
    });
  });
});
