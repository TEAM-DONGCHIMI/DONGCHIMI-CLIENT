import {
  PRODUCT_CATEGORY_FILTER_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
  type ProductCategoryFilterOptionTypes,
  type ProductCategoryGroupTypes,
} from '@/shared/constants/product-categories';

export const productCategoryOptions = PRODUCT_CATEGORY_FILTER_OPTIONS;
export const productSelectableCategoryOptions = PRODUCT_CATEGORY_GROUP_OPTIONS;

export type ProductCategoryTypes = ProductCategoryFilterOptionTypes;
export type ProductSelectableCategoryTypes = ProductCategoryGroupTypes;

export const isProductSelectableCategory = (
  categoryName: string,
): categoryName is ProductSelectableCategoryTypes => {
  return productSelectableCategoryOptions.includes(categoryName as ProductSelectableCategoryTypes);
};
