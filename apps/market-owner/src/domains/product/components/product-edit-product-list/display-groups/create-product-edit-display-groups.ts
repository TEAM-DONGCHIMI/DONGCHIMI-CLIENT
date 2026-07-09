import {
  type ProductEditCardProps,
  type ProductEditGroupableProduct,
  type ProductEditGroupFilterTypes,
  type ProductEditProductGroup,
} from './display-group.types';

interface CreateProductEditDisplayGroupsParams<ProductTypes extends ProductEditGroupableProduct> {
  createCardProps: (product: ProductTypes) => ProductEditCardProps;
  products: readonly ProductTypes[];
  selectedFilter: ProductEditGroupFilterTypes;
  supportsCategoryFilter: boolean;
}

const HIGH_VIEW_COUNT_GROUP_TITLE = '조회수 높은 순';

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

// 선택된 pill filter 값에 맞게 상품 그룹 설정
export const createProductEditDisplayGroups = <ProductTypes extends ProductEditGroupableProduct>({
  createCardProps,
  products,
  selectedFilter,
  supportsCategoryFilter,
}: CreateProductEditDisplayGroupsParams<ProductTypes>): ProductEditProductGroup[] => {
  if (selectedFilter === 'category' && supportsCategoryFilter) {
    return createGroupedProductSections(
      products,
      (product) => product.categoryName,
      createCardProps,
    );
  }

  if (selectedFilter === 'views') {
    return [
      {
        products: [...products]
          .sort((previousProduct, nextProduct) => nextProduct.viewCount - previousProduct.viewCount)
          .map(createCardProps),
        title: HIGH_VIEW_COUNT_GROUP_TITLE,
      },
    ];
  }

  return createGroupedProductSections(
    products,
    (product) => product.registeredDateLabel,
    createCardProps,
  );
};
