import { useMemo } from 'react';

import {
  createProductEditCardProps,
  createProductEditDisplayGroups,
  ProductEditProductList,
  ProductEditProductListLoading,
} from '@/domains/product/components/product-edit-product-list';
import {
  type ProductEditFilterTypes,
  type ProductEditPageSelectionControls,
} from '@/domains/product/components/product-edit-page-shell';
import { type ProductCategoryTypes } from '@/domains/product/constants';
import { useProductEditProducts, useProductListInfiniteQuery } from '@/domains/product/hooks';
import {
  createProductEditListItems,
  getProductListSort,
  type ProductEditListItemTypes,
} from '@/domains/product/model/product-list';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

interface EventDiscountEditProductSectionProps {
  autoOpenProductId?: string | null;
  deletePending: boolean;
  marketId: number;
  selection: ProductEditPageSelectionControls;
  selectedCategory: ProductCategoryTypes | null;
  selectedFilter: ProductEditFilterTypes;
  onAutoOpenProductMissing?: (productId: string) => void;
  onAutoOpenProductModalClose?: () => void;
  onDeleteProduct: (productId: number) => Promise<boolean>;
}

interface EventDiscountEditProductListProps extends EventDiscountEditProductSectionProps {
  initialProducts: ProductEditListItemTypes[];
  hasNextPage: boolean;
  isFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  onLoadNextPage: () => void;
}

const EventDiscountEditProductList = ({
  autoOpenProductId,
  deletePending,
  initialProducts,
  hasNextPage,
  isFetchNextPageError,
  isFetchingNextPage,
  marketId,
  selection,
  selectedCategory,
  selectedFilter,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
  onDeleteProduct,
  onLoadNextPage,
}: EventDiscountEditProductListProps) => {
  const { deleteProduct, products, updateProduct } = useProductEditProducts(
    initialProducts,
    onDeleteProduct,
  );
  const productGroups = createProductEditDisplayGroups({
    createCardProps: (product) =>
      createProductEditCardProps({
        product,
        variant: 'eventDiscount',
      }),
    products,
    selectedCategory,
    selectedFilter,
    supportsCategoryFilter: true,
  });

  return (
    <ProductEditProductList
      ariaLabel='행사 할인 상품 수정 목록'
      autoOpenProductId={autoOpenProductId}
      deletePending={deletePending}
      editModalVariant='eventDiscount'
      groups={productGroups}
      hasNextPage={hasNextPage}
      isFetchNextPageError={isFetchNextPageError}
      isFetchingNextPage={isFetchingNextPage}
      marketId={marketId}
      registrationHref={MARKET_OWNER_ROUTES.eventDiscountRegistration}
      selectedProductIds={selection.selectedProductIds}
      selectionMode={selection.selectionMode}
      onAutoOpenProductMissing={onAutoOpenProductMissing}
      onAutoOpenProductModalClose={onAutoOpenProductModalClose}
      onDeleteProduct={(product) => void deleteProduct(Number(product.productId))}
      onLoadNextPage={onLoadNextPage}
      onToggleProductSelection={selection.onToggleProductSelection}
      onUpdateProduct={updateProduct}
    />
  );
};

export const EventDiscountEditProductSection = (props: EventDiscountEditProductSectionProps) => {
  const productListQuery = useProductListInfiniteQuery({
    marketId: props.marketId,
    sort: getProductListSort(props.selectedFilter),
    type: 'PERIODIC',
  });

  const products = useMemo(
    () => createProductEditListItems(productListQuery.data?.pages ?? []),
    [productListQuery.data?.pages],
  );

  if (productListQuery.isPending) {
    return <ProductEditProductListLoading />;
  }

  if (productListQuery.isError && productListQuery.data == null) {
    throw productListQuery.error;
  }

  const loadNextPage = () => {
    void productListQuery.fetchNextPage({ cancelRefetch: false });
  };

  return (
    <EventDiscountEditProductList
      {...props}
      hasNextPage={Boolean(productListQuery.hasNextPage)}
      initialProducts={products}
      isFetchNextPageError={productListQuery.isFetchNextPageError}
      isFetchingNextPage={productListQuery.isFetchingNextPage}
      marketId={props.marketId}
      onLoadNextPage={loadNextPage}
    />
  );
};
