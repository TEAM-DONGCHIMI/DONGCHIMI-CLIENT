import { productCategoryOptions, type ProductCategoryTypes } from '../../../constants';
import {
  type ProductEditCardProps,
  type ProductEditGroupableProduct,
  type ProductEditGroupFilterTypes,
  type ProductEditProductGroup,
} from './display-group.types';

interface CreateProductEditDisplayGroupsParams<ProductTypes extends ProductEditGroupableProduct> {
  createCardProps: (product: ProductTypes) => ProductEditCardProps;
  products: readonly ProductTypes[];
  selectedCategory?: ProductCategoryTypes | null;
  selectedFilter: ProductEditGroupFilterTypes;
  supportsCategoryFilter: boolean;
}

const ALL_CATEGORY = '전체';
const HIGH_VIEW_COUNT_GROUP_TITLE = '조회수 높은 순';
const FALLBACK_SORT_TIME = 0;

const parseProductEditSortDate = (date?: string) => {
  if (date == null) {
    return FALLBACK_SORT_TIME;
  }

  const match = date.match(/(\d{4})[년.-]\s*(\d{1,2})[월.-]\s*(\d{1,2})/);

  if (match == null) {
    return FALLBACK_SORT_TIME;
  }

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
};

const getRegisteredSortTime = (product: ProductEditGroupableProduct) => {
  return parseProductEditSortDate(product.registeredAt ?? product.registeredDateLabel);
};

const sortProductsBy = <ProductTypes extends ProductEditGroupableProduct>(
  products: readonly ProductTypes[],
  compareProducts: (previousProduct: ProductTypes, nextProduct: ProductTypes) => number,
) => {
  return [...products]
    .map((product, index) => ({
      index,
      product,
    }))
    .sort((previousItem, nextItem) => {
      const order = compareProducts(previousItem.product, nextItem.product);

      return order === 0 ? previousItem.index - nextItem.index : order;
    })
    .map(({ product }) => product);
};

const compareByRegisteredDateDesc = <ProductTypes extends ProductEditGroupableProduct>(
  previousProduct: ProductTypes,
  nextProduct: ProductTypes,
) => {
  return getRegisteredSortTime(nextProduct) - getRegisteredSortTime(previousProduct);
};

const sortByRegisteredDateDesc = <ProductTypes extends ProductEditGroupableProduct>(
  products: readonly ProductTypes[],
) => {
  return sortProductsBy(products, compareByRegisteredDateDesc);
};

const groupProductsBy = <ProductTypes extends ProductEditGroupableProduct>(
  products: readonly ProductTypes[],
  getKey: (product: ProductTypes) => string,
) => {
  return products.reduce<Record<string, ProductTypes[]>>((groups, product) => {
    const key = getKey(product);

    return {
      ...groups,
      [key]: [...(groups[key] ?? []), product],
    };
  }, {});
};

const createGroupedProductSections = <ProductTypes extends ProductEditGroupableProduct>(
  products: readonly ProductTypes[],
  getGroupTitle: (product: ProductTypes) => string,
  createCardProps: (product: ProductTypes) => ProductEditCardProps,
): ProductEditProductGroup[] => {
  const groups = groupProductsBy(products, getGroupTitle);

  return Object.entries(groups).map(([title, groupProducts]) => ({
    products: groupProducts.map(createCardProps),
    title,
  }));
};

const createRegisteredDateGroups = <ProductTypes extends ProductEditGroupableProduct>(
  products: readonly ProductTypes[],
  createCardProps: (product: ProductTypes) => ProductEditCardProps,
) => {
  return createGroupedProductSections(
    sortByRegisteredDateDesc(products),
    (product) => product.registeredDateLabel,
    createCardProps,
  );
};

const createViewCountGroup = <ProductTypes extends ProductEditGroupableProduct>(
  products: readonly ProductTypes[],
  createCardProps: (product: ProductTypes) => ProductEditCardProps,
) => {
  return [
    {
      products: sortProductsBy(products, (previousProduct, nextProduct) => {
        const viewCountOrder = (nextProduct.viewCount ?? 0) - (previousProduct.viewCount ?? 0);

        if (viewCountOrder !== 0) {
          return viewCountOrder;
        }

        return compareByRegisteredDateDesc(previousProduct, nextProduct);
      }).map(createCardProps),
      title: HIGH_VIEW_COUNT_GROUP_TITLE,
    },
  ];
};

const createCategoryGroup = <ProductTypes extends ProductEditGroupableProduct>(
  products: readonly ProductTypes[],
  selectedCategory: ProductCategoryTypes | null,
  createCardProps: (product: ProductTypes) => ProductEditCardProps,
) => {
  if (selectedCategory != null && selectedCategory !== ALL_CATEGORY) {
    return [
      {
        products: products
          .filter((product) => product.categoryName === selectedCategory)
          .map(createCardProps),
        title: selectedCategory,
      },
    ];
  }

  return productCategoryOptions
    .filter((category) => category !== ALL_CATEGORY)
    .map((category) => ({
      products: products
        .filter((product) => product.categoryName === category)
        .map(createCardProps),
      title: category,
    }))
    .filter(({ products: categoryProducts }) => categoryProducts.length > 0);
};

export const createProductEditDisplayGroups = <ProductTypes extends ProductEditGroupableProduct>({
  createCardProps,
  products,
  selectedCategory = null,
  selectedFilter,
  supportsCategoryFilter,
}: CreateProductEditDisplayGroupsParams<ProductTypes>): ProductEditProductGroup[] => {
  if (selectedFilter === 'category' && supportsCategoryFilter) {
    return createCategoryGroup(products, selectedCategory, createCardProps);
  }

  if (selectedFilter === 'views') {
    return createViewCountGroup(products, createCardProps);
  }

  return createRegisteredDateGroups(products, createCardProps);
};
