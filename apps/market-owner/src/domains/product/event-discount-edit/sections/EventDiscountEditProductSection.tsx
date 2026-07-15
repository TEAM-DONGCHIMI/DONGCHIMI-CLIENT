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
}

const EventDiscountEditProductList = ({
  autoOpenProductId,
  deletePending,
  initialProducts,
  marketId,
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

  return (
    <ProductEditProductList
      ariaLabel='행사 할인 상품 수정 목록'
      autoOpenProductId={autoOpenProductId}
      deletePending={deletePending}
      editModalVariant='eventDiscount'
      groups={productGroups}
      marketId={marketId}
      registrationHref={MARKET_OWNER_ROUTES.eventDiscountRegistration}
      selectedProductNames={selection.selectedProductNames}
      selectionMode={selection.selectionMode}
      onAutoOpenProductMissing={onAutoOpenProductMissing}
      onAutoOpenProductModalClose={onAutoOpenProductModalClose}
      onDeleteProduct={(product) => void deleteProduct(Number(product.productId))}
      onToggleProductSelection={selection.onToggleProductSelection}
      onUpdateProduct={updateProduct}
    />
  );
};

export const EventDiscountEditProductSection = (props: EventDiscountEditProductSectionProps) => {
  const productListQuery = useProductListQuery({
    marketId: props.marketId,
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
      marketId={props.marketId}
    />
  );
};
