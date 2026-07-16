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
import { useProductEditProducts, useProductListInfiniteQuery } from '@/domains/product/hooks';
import {
  createProductEditListItems,
  getProductListSort,
  type ProductEditListItemTypes,
} from '@/domains/product/model/product-list';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

interface TodaySpecialEditProductSectionProps {
  autoOpenProductId?: string | null;
  deletePending: boolean;
  marketId: number;
  selection: ProductEditPageSelectionControls;
  selectedFilter: ProductEditFilterTypes;
  onAutoOpenProductMissing?: (productId: string) => void;
  onAutoOpenProductModalClose?: () => void;
  onDeleteProduct: (productId: number) => Promise<boolean>;
}

interface TodaySpecialEditProductListProps extends TodaySpecialEditProductSectionProps {
  initialProducts: ProductEditListItemTypes[];
  pagination: ProductEditListPagination;
}

const TodaySpecialEditProductList = ({
  autoOpenProductId,
  deletePending,
  initialProducts,
  marketId,
  pagination,
  selection,
  selectedFilter,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
  onDeleteProduct,
}: TodaySpecialEditProductListProps) => {
  const { deleteProduct, products, updateProduct } = useProductEditProducts(
    initialProducts,
    onDeleteProduct,
  );
  const productGroups = createProductEditDisplayGroups({
    createCardProps: (product) =>
      createProductEditCardProps({
        product,
        variant: 'todaySpecial',
      }),
    products,
    selectedFilter,
    supportsCategoryFilter: false,
  });
  const productActions = useProductEditListActions({
    autoOpenProductId,
    groups: productGroups,
    marketId,
    selectionMode: selection.selectionMode,
    variant: 'todaySpecial',
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
      ariaLabel='오늘의 특가 상품 수정 목록'
      groups={productGroups}
      pagination={pagination}
      registrationHref={MARKET_OWNER_ROUTES.todaySpecialRegistration}
      selection={{
        enabled: selection.selectionMode,
        selectedProductIds: selection.selectedProductIds,
        onToggleProduct: selection.onToggleProductSelection,
      }}
    />
  );
};

export const TodaySpecialEditProductSection = (props: TodaySpecialEditProductSectionProps) => {
  const productListQuery = useProductListInfiniteQuery({
    marketId: props.marketId,
    sort: getProductListSort(props.selectedFilter),
    type: 'DAILY',
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
    <TodaySpecialEditProductList
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
