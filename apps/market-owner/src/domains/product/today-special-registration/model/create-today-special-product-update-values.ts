import type { ProductUpdateFormValuesTypes } from '../../model/create-product-update-request';
import { isProductSelectableCategory } from '../../constants';

import type { TodaySpecialProductFormTypes } from './product-form.types';

export const createTodaySpecialProductUpdateValues = (
  product: TodaySpecialProductFormTypes,
): ProductUpdateFormValuesTypes => {
  if (!isProductSelectableCategory(product.category)) {
    throw new Error(`Unsupported product category: ${product.category}`);
  }

  return {
    categoryName: product.category,
    endDate: product.startDate,
    originalPrice: product.salePrice,
    productName: product.name,
    promotionText: product.description,
    salePrice: product.specialPrice,
    startDate: product.startDate,
  };
};
