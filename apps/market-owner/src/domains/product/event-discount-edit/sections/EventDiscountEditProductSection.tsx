import {
  ProductEditProductList,
  type ProductEditProductGroup,
} from '@/domains/product/components/product-edit-product-list';
import { type ProductEditFilterTypes } from '@/domains/product/components/product-edit-page-shell';

import { eventDiscountEditProducts } from '../fixtures';

interface EventDiscountEditProductSectionProps {
  selectedFilter: ProductEditFilterTypes;
}

const createCardProps = (product: (typeof eventDiscountEditProducts)[number]) => ({
  ...product,
  'aria-label': `${product.productName} 행사 할인 상품 수정 카드`,
  periodDiscountDate: true,
  todayDiscountPrice: false,
});

const groupProductsBy = <KeyTypes extends string>(
  products: typeof eventDiscountEditProducts,
  getKey: (product: (typeof eventDiscountEditProducts)[number]) => KeyTypes,
) => {
  return products.reduce<Record<KeyTypes, typeof eventDiscountEditProducts>>(
    (groups, product) => {
      const key = getKey(product);

      return {
        ...groups,
        [key]: [...(groups[key] ?? []), product],
      };
    },
    {} as Record<KeyTypes, typeof eventDiscountEditProducts>,
  );
};

const createCategoryGroups = (): ProductEditProductGroup[] => {
  const groups = groupProductsBy(eventDiscountEditProducts, (product) => product.categoryName);

  return Object.entries(groups).map(([title, products]) => ({
    products: products.map(createCardProps),
    title,
  }));
};

const createRegisteredDateGroups = (): ProductEditProductGroup[] => {
  const groups = groupProductsBy(
    eventDiscountEditProducts,
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
      products: [...eventDiscountEditProducts]
        .sort((previousProduct, nextProduct) => nextProduct.viewCount - previousProduct.viewCount)
        .map(createCardProps),
      title: '조회수 높은 순',
    },
  ];
};

const productGroupsByFilter = {
  category: createCategoryGroups,
  registered: createRegisteredDateGroups,
  views: createViewGroups,
} satisfies Record<ProductEditFilterTypes, () => ProductEditProductGroup[]>;

export const EventDiscountEditProductSection = ({
  selectedFilter,
}: EventDiscountEditProductSectionProps) => {
  return (
    <ProductEditProductList
      ariaLabel='행사 할인 상품 수정 목록'
      groups={productGroupsByFilter[selectedFilter]()}
    />
  );
};
