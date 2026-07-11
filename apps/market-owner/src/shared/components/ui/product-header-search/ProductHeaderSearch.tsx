import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';
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
  onProductLoadError?: () => void;
  products: readonly ProductHeaderSearchProductTypes[];
}

const SEARCH_PRODUCT_ID_PARAM = 'productId';

const productSearchLabelByDealType = {
  DAILY: '오늘의 특가',
  PERIODIC: '행사 할인',
} satisfies Record<ProductHeaderSearchDealTypes, string>;

const productEditRouteByDealType = {
  DAILY: MARKET_OWNER_ROUTES.todaySpecialEdit,
  PERIODIC: MARKET_OWNER_ROUTES.eventDiscountEdit,
} satisfies Record<ProductHeaderSearchDealTypes, MarketOwnerRouteTypes>;

const normalizeSearchText = (value: string) => value.toLocaleLowerCase('ko-KR').replace(/\s+/g, '');

const getDefaultProductsByQuery = (
  query: string,
  products: readonly ProductHeaderSearchProductTypes[],
) => {
  const normalizedQuery = normalizeSearchText(query);

  if (normalizedQuery.length === 0) {
    return [];
  }

  return products.filter((product) =>
    normalizeSearchText(
      `${productSearchLabelByDealType[product.dealType]}${product.name}`,
    ).includes(normalizedQuery),
  );
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

const createProductEditSearchPath = (product: ProductHeaderSearchProductTypes) => {
  const searchParams = new URLSearchParams({
    [SEARCH_PRODUCT_ID_PARAM]: String(product.productId),
  });

  return `${productEditRouteByDealType[product.dealType]}?${searchParams.toString()}`;
};

export const ProductHeaderSearch = ({
  getProductsByQuery = getDefaultProductsByQuery,
  onProductLoadError,
  products,
}: ProductHeaderSearchProps) => {
  const navigate = useNavigate();
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

  return (
    <ProductSearchPanel
      isPending={isSearchPending}
      items={searchPanelItems}
      onQueryChange={(nextQuery) => setQuery(nextQuery)}
      onSelectProduct={(item) => {
        const selectedProduct = searchProducts.find(
          (product) => String(product.productId) === item.id,
        );

        if (selectedProduct == null || selectedProduct.isProductInfoLoadable === false) {
          onProductLoadError?.();

          return;
        }

        navigate(createProductEditSearchPath(selectedProduct));
      }}
    />
  );
};
