import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
  type ProductEditGroupableProduct,
} from './display-group.types';

interface CreateProductEditCardPropsParams<ProductTypes extends ProductEditGroupableProduct> {
  product: ProductTypes;
  variant: ProductEditCardVariantTypes;
}

const productEditCardCopyByVariant = {
  eventDiscount: {
    ariaLabelSuffix: '행사 할인 상품 수정 카드',
    periodDiscountDate: true,
    todayDiscountPrice: false,
  },
  todaySpecial: {
    ariaLabelSuffix: '오늘의 특가 상품 수정 카드',
    periodDiscountDate: false,
    todayDiscountPrice: true,
  },
} satisfies Record<
  ProductEditCardVariantTypes,
  Pick<ProductEditCardProps, 'periodDiscountDate' | 'todayDiscountPrice'> & {
    ariaLabelSuffix: string;
  }
>;

// 유형별 카드 노출 props 생성
export const createProductEditCardProps = <ProductTypes extends ProductEditGroupableProduct>({
  product,
  variant,
}: CreateProductEditCardPropsParams<ProductTypes>): ProductEditCardProps => {
  const { ariaLabelSuffix, periodDiscountDate, todayDiscountPrice } =
    productEditCardCopyByVariant[variant];
  const { registeredAt, registeredDateLabel, ...cardProduct } = product;
  void registeredAt;
  void registeredDateLabel;

  return {
    ...cardProduct,
    'aria-label': `${product.productName} ${ariaLabelSuffix}`,
    periodDiscountDate,
    todayDiscountPrice,
  };
};
