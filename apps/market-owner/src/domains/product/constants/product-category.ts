import {
  PRODUCT_CATEGORY_FILTER_OPTIONS,
  type ProductCategoryFilterOptionTypes,
} from '@/shared/constants/product-categories';

export const productCategoryOptions = PRODUCT_CATEGORY_FILTER_OPTIONS;
export const productSelectableCategoryOptions = PRODUCT_CATEGORY_FILTER_OPTIONS;

export type ProductCategoryTypes = ProductCategoryFilterOptionTypes;
export type ProductSelectableCategoryTypes = ProductCategoryFilterOptionTypes;

export const isProductSelectableCategory = (
  categoryName: string,
): categoryName is ProductSelectableCategoryTypes => {
  return productSelectableCategoryOptions.includes(categoryName as ProductSelectableCategoryTypes);
};
