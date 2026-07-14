import { describe, expect, it } from 'vitest';

import { createEmptyTodaySpecialProductForm } from './product-form.utils';
import { createDailyProductRequest } from './create-daily-product-request';

describe('createDailyProductRequest', () => {
  it('maps the registration form and uploaded object key to the API request', () => {
    const request = createDailyProductRequest({
      product: {
        ...createEmptyTodaySpecialProductForm(),
        category: '채소/과일',
        description: '  멋쟁이 토마토  ',
        name: '  토마토  ',
        salePrice: '5,000',
        specialPrice: '4,500',
        startDate: '2026-06-30',
      },
      uploadedImageObjectKey: 'tmp/PRODUCT_THUMBNAIL/product.png',
    });

    expect(request).toEqual({
      thumbnailUrl: 'tmp/PRODUCT_THUMBNAIL/product.png',
      name: '토마토',
      category: 'VEGETABLE_FRUIT',
      promotionalPhrase: '멋쟁이 토마토',
      originalPrice: 5000,
      discountedPrice: 4500,
      discountStartDate: '2026-06-30',
      discountEndDate: '2026-06-30',
    });
  });

  it('uses the default product image and omits the promotional phrase when optional inputs are empty', () => {
    const request = createDailyProductRequest({
      product: {
        ...createEmptyTodaySpecialProductForm(),
        category: '기타',
        name: '상품',
        salePrice: '2,000',
        specialPrice: '1,000',
        startDate: '2026-06-30',
      },
      uploadedImageObjectKey: null,
    });

    expect(request).toEqual({
      thumbnailUrl: '/images/product-replace.svg',
      name: '상품',
      category: 'ETC',
      originalPrice: 2000,
      discountedPrice: 1000,
      discountStartDate: '2026-06-30',
      discountEndDate: '2026-06-30',
    });
  });
});
