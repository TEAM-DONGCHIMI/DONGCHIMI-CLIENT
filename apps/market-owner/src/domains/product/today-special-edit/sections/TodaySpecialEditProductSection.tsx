import {
  ProductEditProductList,
  type ProductEditProductGroup,
} from '@/domains/product/components/product-edit-product-list';
import {
  type ProductEditFilterTypes,
  type ProductEditSortTypes,
} from '@/domains/product/components/product-edit-page-shell';

import { todaySpecialEditProducts } from '../fixtures';

interface TodaySpecialEditProductSectionProps {
  selectedFilter: ProductEditFilterTypes;
}

const createCardProps = (product: (typeof todaySpecialEditProducts)[number]) => ({
  ...product,
  'aria-label': `${product.productName} 오늘의 특가 상품 수정 카드`,
  periodDiscountDate: false,
  todayDiscountPrice: true,
});

const groupProductsBy = <KeyTypes extends string>(
  products: typeof todaySpecialEditProducts,
  getKey: (product: (typeof todaySpecialEditProducts)[number]) => KeyTypes,
) => {
  return products.reduce<Record<KeyTypes, typeof todaySpecialEditProducts>>(
    (groups, product) => {
      const key = getKey(product);

      return {
        ...groups,
        [key]: [...(groups[key] ?? []), product],
      };
    },
    {} as Record<KeyTypes, typeof todaySpecialEditProducts>,
  );
};

const createRegisteredDateGroups = (): ProductEditProductGroup[] => {
  const groups = groupProductsBy(
    todaySpecialEditProducts,
    (product) => product.registeredDateLabel,
  );

  return Object.entries(groups).map(([title, products]) => ({
    products: products.map(createCardProps),
    title,
  }));
};

const createViewGroups = (): ProductEditProductGroup[] => {
  return [
    {
      products: [...todaySpecialEditProducts]
        .sort((previousProduct, nextProduct) => nextProduct.viewCount - previousProduct.viewCount)
        .map(createCardProps),
      title: '조회수 높은 순',
    },
  ];
};

const productGroupsByFilter = {
  registered: createRegisteredDateGroups,
  views: createViewGroups,
} satisfies Record<ProductEditSortTypes, () => ProductEditProductGroup[]>;

export const TodaySpecialEditProductSection = ({
  selectedFilter,
}: TodaySpecialEditProductSectionProps) => {
  const selectedSort = selectedFilter === 'category' ? 'registered' : selectedFilter;

  return (
    <ProductEditProductList
      ariaLabel='오늘의 특가 상품 수정 목록'
      groups={productGroupsByFilter[selectedSort]()}
    />
  );
};
