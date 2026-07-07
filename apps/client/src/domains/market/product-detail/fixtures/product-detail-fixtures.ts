type TodaySpecialPromotionTypes = Readonly<{
  discountRateText: string;
  originalPriceText: string;
  salePriceText: string;
  type: 'today-special';
}>;

type EventDiscountPromotionTypes = Readonly<{
  periodText: string;
  salePriceText: string;
  type: 'event-discount';
}>;

export type ProductDetailPromotionTypes = TodaySpecialPromotionTypes | EventDiscountPromotionTypes;

export type ProductDetailFixtureTypes = Readonly<{
  headerTitle: string;
  imageAlt: string;
  marketName: string;
  martComment?: string;
  productName: string;
  promotion: ProductDetailPromotionTypes;
  promotionLabel: string;
}>;

const TODAY_SPECIAL_PRODUCT_DETAIL = {
  headerTitle: '오늘의 특가',
  imageAlt: '삼겹살 500g 상품 이미지',
  marketName: '망원 신선마트',
  martComment: '오늘 들어온 삼겹살, 마감 전까지 특가로 드려요!',
  productName: '삼겹살 500g',
  promotion: {
    discountRateText: '10%',
    originalPriceText: '5,000원',
    salePriceText: '4,500원',
    type: 'today-special',
  },
  promotionLabel: '오늘의 특가',
} satisfies ProductDetailFixtureTypes;

const EVENT_DISCOUNT_PRODUCT_DETAIL = {
  headerTitle: '행사 할인 상품',
  imageAlt: '삼겹살 500g 상품 이미지',
  marketName: '망원 신선마트',
  martComment: '오늘 들어온 삼겹살, 마감 전까지 특가로 드려요!',
  productName: '삼겹살 500g',
  promotion: {
    periodText: '6.18 ~ 6.25',
    salePriceText: '12,000원',
    type: 'event-discount',
  },
  promotionLabel: '행사 할인 품목',
} satisfies ProductDetailFixtureTypes;

const PRODUCT_DETAIL_FIXTURE_BY_ID: Record<string, ProductDetailFixtureTypes> = {
  'event-discount-samgyeopsal-500g': EVENT_DISCOUNT_PRODUCT_DETAIL,
  'event-sale-samgyeopsal-500g': EVENT_DISCOUNT_PRODUCT_DETAIL,
  'samgyeopsal-500g': TODAY_SPECIAL_PRODUCT_DETAIL,
  'today-special-samgyeopsal-500g': TODAY_SPECIAL_PRODUCT_DETAIL,
};

export const getProductDetailFixture = (productId: string): ProductDetailFixtureTypes => {
  const productDetailFixture = PRODUCT_DETAIL_FIXTURE_BY_ID[productId];

  if (productDetailFixture != null) {
    return productDetailFixture;
  }

  return TODAY_SPECIAL_PRODUCT_DETAIL;
};
