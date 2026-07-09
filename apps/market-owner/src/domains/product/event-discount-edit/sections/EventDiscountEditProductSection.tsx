import {
  createProductEditCardProps,
  createProductEditDisplayGroups,
  ProductEditProductList,
} from '@/domains/product/components/product-edit-product-list';
import { type ProductEditFilterTypes } from '@/domains/product/components/product-edit-page-shell';
import { type ProductCategoryTypes } from '@/domains/product/constants';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { eventDiscountEditProducts } from '../fixtures';

interface EventDiscountEditProductSectionProps {
  selectedCategory: ProductCategoryTypes | null;
  selectedFilter: ProductEditFilterTypes;
}

export const EventDiscountEditProductSection = ({
  selectedCategory,
  selectedFilter,
}: EventDiscountEditProductSectionProps) => {
  const productGroups = createProductEditDisplayGroups({
    createCardProps: (product) =>
      createProductEditCardProps({
        product,
        variant: 'eventDiscount',
      }),
    products: eventDiscountEditProducts,
    selectedCategory,
    selectedFilter,
    supportsCategoryFilter: true,
  });

  return (
    <ProductEditProductList
      ariaLabel='행사 할인 상품 수정 목록'
      groups={productGroups}
      registrationHref={MARKET_OWNER_ROUTES.eventDiscountRegistration}
    />
  );
};
