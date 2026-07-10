import {
  createProductEditCardProps,
  createProductEditDisplayGroups,
  ProductEditProductList,
} from '@/domains/product/components/product-edit-product-list';
import { type ProductEditFilterTypes } from '@/domains/product/components/product-edit-page-shell';
import { type ProductCategoryTypes } from '@/domains/product/constants';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { type EventDiscountEditProductTypes } from '../fixtures';

interface EventDiscountEditProductSectionProps {
  products: EventDiscountEditProductTypes[];
  selectedCategory: ProductCategoryTypes | null;
  selectedFilter: ProductEditFilterTypes;
  onDeleteProduct: (productName: string) => void;
}

export const EventDiscountEditProductSection = ({
  products,
  selectedCategory,
  selectedFilter,
  onDeleteProduct,
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
      onDeleteProduct={(product) => onDeleteProduct(product.productName)}
    />
  );
};
