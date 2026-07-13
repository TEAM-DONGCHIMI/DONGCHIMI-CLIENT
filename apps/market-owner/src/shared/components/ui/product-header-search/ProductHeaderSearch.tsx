import { useMemo, useState } from 'react';

import { useDebouncedValue } from '@/shared/hooks';

import { ProductSearchPanel, type ProductSearchPanelItemTypes } from '../product-search-panel';

export type ProductHeaderSearchDealTypes = 'DAILY' | 'PERIODIC';

export interface ProductHeaderSearchProductTypes {
  dealType: ProductHeaderSearchDealTypes;
  isProductInfoLoadable?: boolean;
  name: string;
  productId: number | string;
}

export interface ProductHeaderSearchProps {
  getProductsByQuery?: (
    query: string,
    products: readonly ProductHeaderSearchProductTypes[],
  ) => ProductHeaderSearchProductTypes[];
  onSelectProduct: (product: ProductHeaderSearchProductTypes) => void;
  products: readonly ProductHeaderSearchProductTypes[];
}

const productSearchLabelByDealType = {
  DAILY: '오늘의 특가',
  PERIODIC: '행사 할인',
} satisfies Record<ProductHeaderSearchDealTypes, string>;

const normalizeSearchText = (value: string) => value.toLocaleLowerCase('ko-KR').replace(/\s+/g, '');

const getDefaultProductsByQuery = (
  query: string,
  products: readonly ProductHeaderSearchProductTypes[],
) => {
  const normalizedQuery = normalizeSearchText(query);

  if (normalizedQuery.length === 0) {
    return [];
  }

  return products.filter((product) => normalizeSearchText(product.name).includes(normalizedQuery));
};

const createProductSearchPanelItem = (
  product: ProductHeaderSearchProductTypes,
): ProductSearchPanelItemTypes => {
  return {
    id: String(product.productId),
    label: productSearchLabelByDealType[product.dealType],
    name: product.name,
  };
};

export const ProductHeaderSearch = ({
  getProductsByQuery = getDefaultProductsByQuery,
  onSelectProduct,
  products,
}: ProductHeaderSearchProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const isSearchPending = query.trim().length > 0 && query !== debouncedQuery;
  const searchProducts = useMemo(
    () => getProductsByQuery(debouncedQuery, products),
    [debouncedQuery, getProductsByQuery, products],
  );
  const searchPanelItems = useMemo(
    () => searchProducts.map(createProductSearchPanelItem),
    [searchProducts],
  );

  const handleSelectProduct = (item: ProductSearchPanelItemTypes) => {
    const selectedProduct = searchProducts.find((product) => String(product.productId) === item.id);

    if (selectedProduct == null) {
      return;
    }

    onSelectProduct(selectedProduct);
  };

  return (
    <ProductSearchPanel
      isPending={isSearchPending}
      items={searchPanelItems}
      onQueryChange={(nextQuery) => setQuery(nextQuery)}
      onSelectProduct={handleSelectProduct}
    />
  );
};
