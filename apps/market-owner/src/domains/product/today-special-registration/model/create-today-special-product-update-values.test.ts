import { describe, expect, it } from 'vitest';

import { createTodaySpecialProductUpdateValues } from './create-today-special-product-update-values';
import { createEmptyTodaySpecialProductForm } from './product-form.utils';

describe('createTodaySpecialProductUpdateValues', () => {
  it('maps the registration form fields to the shared daily product update values', () => {
    expect(
      createTodaySpecialProductUpdateValues({
        ...createEmptyTodaySpecialProductForm(),
        category: '채소/과일',
        description: '오늘만 할인',
        name: '딸기 2팩',
        productId: 101,
        salePrice: '5,000',
        specialPrice: '4,500',
        startDate: '2026-07-16',
      }),
    ).toEqual({
      categoryName: '채소/과일',
      endDate: '2026-07-16',
      originalPrice: '5,000',
      productName: '딸기 2팩',
      promotionText: '오늘만 할인',
      salePrice: '4,500',
      startDate: '2026-07-16',
    });
  });

  it('rejects a category outside the product update contract', () => {
    expect(() =>
      createTodaySpecialProductUpdateValues({
        ...createEmptyTodaySpecialProductForm(),
        category: '지원하지 않는 카테고리',
      }),
    ).toThrow('Unsupported product category');
  });
});
