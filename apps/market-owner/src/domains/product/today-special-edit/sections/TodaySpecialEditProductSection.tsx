import {
  createProductEditCardProps,
  createProductEditDisplayGroups,
  ProductEditProductList,
} from '@/domains/product/components/product-edit-product-list';
import { type ProductEditFilterTypes } from '@/domains/product/components/product-edit-page-shell';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { todaySpecialEditProducts } from '../fixtures';

interface TodaySpecialEditProductSectionProps {
  selectedFilter: ProductEditFilterTypes;
}

export const TodaySpecialEditProductSection = ({
  selectedFilter,
}: TodaySpecialEditProductSectionProps) => {
  const productGroups = createProductEditDisplayGroups({
    createCardProps: (product) =>
      createProductEditCardProps({
        product,
        variant: 'todaySpecial',
      }),
    products: todaySpecialEditProducts,
    selectedFilter,
    supportsCategoryFilter: false,
  });

  return (
    <ProductEditProductList
      ariaLabel='오늘의 특가 상품 수정 목록'
      groups={productGroups}
      registrationHref={MARKET_OWNER_ROUTES.todaySpecialRegistration}
    />
  );
};
