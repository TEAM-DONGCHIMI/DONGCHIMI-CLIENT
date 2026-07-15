import { useEffect, useMemo, useState } from 'react';

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
  isPending?: boolean;
  onQueryChange?: (query: string) => void;
  onSelectProduct: (product: ProductHeaderSearchProductTypes) => void;
  products: readonly ProductHeaderSearchProductTypes[];
  status?: 'default' | 'error';
}

const productSearchLabelByDealType = {
  DAILY: '오늘의 특가',
  PERIODIC: '행사 할인',
} satisfies Record<ProductHeaderSearchDealTypes, string>;

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
  isPending = false,
  onQueryChange,
  onSelectProduct,
  products,
  status = 'default',
}: ProductHeaderSearchProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const normalizedDebouncedQuery = debouncedQuery.trim();
  const isSearchPending = query.trim().length > 0 && (query !== debouncedQuery || isPending);
  const searchProducts = useMemo(
    () => (normalizedDebouncedQuery.length > 0 ? products : []),
    [normalizedDebouncedQuery, products],
  );
  const searchPanelItems = useMemo(
    () => searchProducts.map(createProductSearchPanelItem),
    [searchProducts],
  );

  useEffect(() => {
    onQueryChange?.(normalizedDebouncedQuery);
  }, [normalizedDebouncedQuery, onQueryChange]);

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
      status={status}
    />
  );
};
