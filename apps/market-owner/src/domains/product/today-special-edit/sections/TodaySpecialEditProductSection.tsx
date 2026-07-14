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
import { useProductEditProducts, useProductListQuery } from '@/domains/product/hooks';
import {
  createProductEditListItem,
  getProductListSort,
  type ProductEditListItemTypes,
} from '@/domains/product/model/product-list';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

interface TodaySpecialEditProductSectionProps {
  autoOpenProductId?: string | null;
  selection: ProductEditPageSelectionControls;
  selectedFilter: ProductEditFilterTypes;
  onAutoOpenProductMissing?: (productId: string) => void;
  onAutoOpenProductModalClose?: () => void;
}

interface TodaySpecialEditProductListProps extends TodaySpecialEditProductSectionProps {
  initialProducts: ProductEditListItemTypes[];
  marketId: number;
}

const TodaySpecialEditProductList = ({
  autoOpenProductId,
  initialProducts,
  marketId,
  selection,
  selectedFilter,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
}: TodaySpecialEditProductListProps) => {
  const { deleteProduct, products, updateProduct } = useProductEditProducts(initialProducts);
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

  return (
    <ProductEditProductList
      ariaLabel='오늘의 특가 상품 수정 목록'
      autoOpenProductId={autoOpenProductId}
      editModalVariant='todaySpecial'
      groups={productGroups}
      marketId={marketId}
      registrationHref={MARKET_OWNER_ROUTES.todaySpecialRegistration}
      selectedProductNames={selection.selectedProductNames}
      selectionMode={selection.selectionMode}
      onAutoOpenProductMissing={onAutoOpenProductMissing}
      onAutoOpenProductModalClose={onAutoOpenProductModalClose}
      onDeleteProduct={(product) => deleteProduct(product.productName)}
      onToggleProductSelection={selection.onToggleProductSelection}
      onUpdateProduct={updateProduct}
    />
  );
};

export const TodaySpecialEditProductSection = (props: TodaySpecialEditProductSectionProps) => {
  // TODO: 로그인 세션에서 담당 마트 ID를 제공하면 해당 값으로 교체합니다.
  const marketId = 1;
  const productListQuery = useProductListQuery({
    marketId,
    sort: getProductListSort(props.selectedFilter),
    type: 'DAILY',
  });

  if (productListQuery.isPending) {
    return <ProductEditProductListLoading />;
  }

  const products = (productListQuery.data?.data?.content ?? []).map(createProductEditListItem);

  return (
    <TodaySpecialEditProductList
      key={props.selectedFilter}
      {...props}
      initialProducts={products}
      marketId={marketId}
    />
  );
};
