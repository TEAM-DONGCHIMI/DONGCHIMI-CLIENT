import {
  PRODUCT_CATEGORY_GROUP_BY_SOURCE,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
  type ProductCategoryGroupTypes,
} from '@/shared/constants/product-categories';

const productCategoryGroupSet: ReadonlySet<string> = new Set(PRODUCT_CATEGORY_GROUP_OPTIONS);
const productCategoryGroupBySource: Readonly<Record<string, ProductCategoryGroupTypes>> =
  PRODUCT_CATEGORY_GROUP_BY_SOURCE;

export const formatProductCategoryDisplayName = (category: string) => {
  return category.replaceAll('/', '･');
};

export const isProductCategoryGroup = (category: string): category is ProductCategoryGroupTypes => {
  return productCategoryGroupSet.has(category);
};

export const getProductCategoryGroup = (category: string): ProductCategoryGroupTypes => {
  if (isProductCategoryGroup(category)) {
    return category;
  }

  return productCategoryGroupBySource[category] ?? '기타';
};

export const getProductMatchesCategoryFilter = (
  category: string,
  selectedCategories: ReadonlySet<ProductCategoryGroupTypes>,
) => {
  if (selectedCategories.size === 0) {
    return true;
  }

  return selectedCategories.has(getProductCategoryGroup(category));
};
