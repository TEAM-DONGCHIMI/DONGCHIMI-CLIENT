import {
  createProductEditCardProps,
  createProductEditDisplayGroups,
  ProductEditProductList,
} from '@/domains/product/components/product-edit-product-list';
import {
  type ProductEditFilterTypes,
  type ProductEditPageSelectionControls,
} from '@/domains/product/components/product-edit-page-shell';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { type TodaySpecialEditProductTypes } from '../fixtures';

interface TodaySpecialEditProductSectionProps {
  products: TodaySpecialEditProductTypes[];
  selection: ProductEditPageSelectionControls;
  selectedFilter: ProductEditFilterTypes;
  onDeleteProduct: (productName: string) => void;
}

export const TodaySpecialEditProductSection = ({
  products,
  selection,
  selectedFilter,
  onDeleteProduct,
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
      editModalVariant='todaySpecial'
      groups={productGroups}
      registrationHref={MARKET_OWNER_ROUTES.todaySpecialRegistration}
      selectedProductNames={selection.selectedProductNames}
      selectionMode={selection.selectionMode}
      onDeleteProduct={(product) => onDeleteProduct(product.productName)}
      onToggleProductSelection={selection.onToggleProductSelection}
    />
  );
};
