import { describe, expect, it } from 'vitest';

import { createProductEditListItem, getProductListSort } from './product-list';

describe('product list model', () => {
  it('maps server category code and product fields to edit card data', () => {
    expect(
      createProductEditListItem({
        productId: 101,
        name: '삼겹살 500g',
        thumbnailUrl: 'https://cdn.dongchimi.kr/products/101.png',
        category: 'MEAT_EGG',
        categoryName: '정육/달걀',
        originalPrice: 5000,
        discountedPrice: 4500,
        promotionalPhrase: '이번 주 한정 특가',
        discountStartDate: '2026-08-16',
        discountEndDate: '2026-08-22',
        viewCount: 162,
        createdAt: '2026-08-15T10:00:00',
      }),
    ).toEqual({
      categoryName: '정육/달걀',
      endDate: '2026-08-22',
      originalPrice: '5,000',
      productId: 101,
      productName: '삼겹살 500g',
      registeredAt: '2026-08-15T10:00:00',
      registeredDateLabel: '2026년 8월 15일',
      salePercent: '10',
      salePrice: '4,500',
      startDate: '2026-08-16',
      viewCount: 162,
    });
  });

  it('maps page filters to API sort values', () => {
    expect(getProductListSort('category')).toBe('CATEGORY');
    expect(getProductListSort('registered')).toBe('LATEST');
    expect(getProductListSort('views')).toBe('VIEW_COUNT');
  });
});
