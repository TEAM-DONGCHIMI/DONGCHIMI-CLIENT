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
import { type ProductCategoryTypes } from '@/domains/product/constants';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { type EventDiscountEditProductTypes } from '../fixtures';

interface EventDiscountEditProductSectionProps {
  products: EventDiscountEditProductTypes[];
  selection: ProductEditPageSelectionControls;
  selectedCategory: ProductCategoryTypes | null;
  selectedFilter: ProductEditFilterTypes;
  onDeleteProduct: (productName: string) => void;
  onUpdateProduct: (productName: string, product: ProductEditCardProps) => void;
}

export const EventDiscountEditProductSection = ({
  products,
  selection,
  selectedCategory,
  selectedFilter,
  onDeleteProduct,
  onUpdateProduct,
}: EventDiscountEditProductSectionProps) => {
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
      editModalVariant='eventDiscount'
      groups={productGroups}
      registrationHref={MARKET_OWNER_ROUTES.eventDiscountRegistration}
      selectedProductNames={selection.selectedProductNames}
      selectionMode={selection.selectionMode}
      onDeleteProduct={(product) => onDeleteProduct(product.productName)}
      onToggleProductSelection={selection.onToggleProductSelection}
      onUpdateProduct={onUpdateProduct}
    />
  );
};
