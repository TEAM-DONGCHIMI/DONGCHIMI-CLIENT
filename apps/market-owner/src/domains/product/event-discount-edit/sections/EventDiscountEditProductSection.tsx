import { useMemo } from 'react';

import {
  createProductEditCardProps,
  createProductEditDisplayGroups,
  ProductEditProductList,
  ProductEditProductListLoading,
  type ProductEditListPagination,
  useProductEditListActions,
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
  pagination: ProductEditListPagination;
}

const EventDiscountEditProductList = ({
  autoOpenProductId,
  deletePending,
  initialProducts,
  marketId,
  pagination,
  selection,
  selectedCategory,
  selectedFilter,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
  onDeleteProduct,
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
  const productActions = useProductEditListActions({
    autoOpenProductId,
    groups: productGroups,
    marketId,
    selectionMode: selection.selectionMode,
    variant: 'eventDiscount',
    onAutoOpenProductMissing,
    onAutoOpenProductModalClose,
    onDeleteProduct: (product) => void deleteProduct(Number(product.productId)),
    onUpdateProduct: updateProduct,
  });

  return (
    <ProductEditProductList
      actions={{
        ...productActions,
        disabled: deletePending,
      }}
      ariaLabel='행사 할인 상품 수정 목록'
      groups={productGroups}
      pagination={pagination}
      registrationHref={MARKET_OWNER_ROUTES.eventDiscountRegistration}
      selection={{
        enabled: selection.selectionMode,
        selectedProductIds: selection.selectedProductIds,
        onToggleProduct: selection.onToggleProductSelection,
      }}
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

  let paginationStatus: ProductEditListPagination['status'] = 'idle';

  if (productListQuery.isFetchNextPageError) {
    paginationStatus = 'error';
  } else if (productListQuery.isFetchingNextPage) {
    paginationStatus = 'loading';
  }

  return (
    <EventDiscountEditProductList
      {...props}
      initialProducts={products}
      marketId={props.marketId}
      pagination={{
        hasNextPage: Boolean(productListQuery.hasNextPage),
        status: paginationStatus,
        onLoadNextPage: () => {
          void productListQuery.fetchNextPage({ cancelRefetch: false });
        },
      }}
    />
  );
};
