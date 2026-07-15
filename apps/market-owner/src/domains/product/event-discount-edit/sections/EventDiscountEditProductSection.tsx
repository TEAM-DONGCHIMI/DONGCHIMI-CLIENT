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
import { useProductEditProducts, useProductListQuery } from '@/domains/product/hooks';
import {
  createProductEditListItem,
  getProductListSort,
  type ProductEditListItemTypes,
} from '@/domains/product/model/product-list';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

interface EventDiscountEditProductSectionProps {
  autoOpenProductId?: string | null;
  selection: ProductEditPageSelectionControls;
  selectedCategory: ProductCategoryTypes | null;
  selectedFilter: ProductEditFilterTypes;
  onAutoOpenProductMissing?: (productId: string) => void;
  onAutoOpenProductModalClose?: () => void;
}

interface EventDiscountEditProductListProps extends EventDiscountEditProductSectionProps {
  initialProducts: ProductEditListItemTypes[];
  marketId: number;
}

const EventDiscountEditProductList = ({
  autoOpenProductId,
  initialProducts,
  marketId,
  selection,
  selectedCategory,
  selectedFilter,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
}: EventDiscountEditProductListProps) => {
  const { deleteProduct, products, updateProduct } = useProductEditProducts(initialProducts);
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
      editModalVariant='eventDiscount'
      groups={productGroups}
      marketId={marketId}
      registrationHref={MARKET_OWNER_ROUTES.eventDiscountRegistration}
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

export const EventDiscountEditProductSection = (props: EventDiscountEditProductSectionProps) => {
  // TODO: 로그인 세션에서 담당 마트 ID를 제공하면 해당 값으로 교체합니다.
  const marketId = 1;
  const productListQuery = useProductListQuery({
    marketId,
    sort: getProductListSort(props.selectedFilter),
    type: 'PERIODIC',
  });

  if (productListQuery.isPending) {
    return <ProductEditProductListLoading />;
  }

  if (productListQuery.isError) {
    throw productListQuery.error;
  }

  const products = (productListQuery.data?.data?.content ?? []).map(createProductEditListItem);
  const productIdsKey = products.map(({ productId }) => productId).join('-');

  return (
    <EventDiscountEditProductList
      key={`${props.selectedFilter}-${productIdsKey}`}
      {...props}
      initialProducts={products}
      marketId={marketId}
    />
  );
};
