import {
  createProductEditCardProps,
  createProductEditDisplayGroups,
  type ProductEditCardProps,
  ProductEditProductList,
} from '@/domains/product/components/product-edit-product-list';
import {
  type ProductEditFilterTypes,
  type ProductEditPageSelectionControls,
} from '@/domains/product/components/product-edit-page-shell';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { type TodaySpecialEditProductTypes } from '../fixtures';

interface TodaySpecialEditProductSectionProps {
  autoOpenProductId?: string | null;
  products: TodaySpecialEditProductTypes[];
  selection: ProductEditPageSelectionControls;
  selectedFilter: ProductEditFilterTypes;
  onAutoOpenProductMissing?: (productId: string) => void;
  onAutoOpenProductModalClose?: () => void;
  onDeleteProduct: (productName: string) => void;
  onUpdateProduct: (productName: string, product: ProductEditCardProps) => void;
}

export const TodaySpecialEditProductSection = ({
  autoOpenProductId,
  products,
  selection,
  selectedFilter,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
  onDeleteProduct,
  onUpdateProduct,
}: TodaySpecialEditProductSectionProps) => {
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
      registrationHref={MARKET_OWNER_ROUTES.todaySpecialRegistration}
      selectedProductNames={selection.selectedProductNames}
      selectionMode={selection.selectionMode}
      onAutoOpenProductMissing={onAutoOpenProductMissing}
      onAutoOpenProductModalClose={onAutoOpenProductModalClose}
      onDeleteProduct={(product) => onDeleteProduct(product.productName)}
      onToggleProductSelection={selection.onToggleProductSelection}
      onUpdateProduct={onUpdateProduct}
    />
  );
};
