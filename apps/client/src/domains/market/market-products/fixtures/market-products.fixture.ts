export interface EventDiscountProductFixtureTypes {
  categoryId: string;
  discountedPrice: number;
  name: string;
  productId: number;
  thumbnailUrl: string | null;
}

export interface EventDiscountProductsPageFixtureTypes {
  hasNext: boolean;
  nextCursor: number | null;
  products: EventDiscountProductFixtureTypes[];
}

export interface EventDiscountCategoryFixtureTypes {
  categoryId: string;
  label: string;
}

export interface EventDiscountProductsFixtureTypes {
  categories: EventDiscountCategoryFixtureTypes[];
  pages: EventDiscountProductsPageFixtureTypes[];
}

export const DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT = 2;

export const marketProductsFixture = {
  eventDiscount: {
    categories: [
      {
        categoryId: 'vegetable-fruit',
        label: '채소·과일',
      },
      {
        categoryId: 'meat-egg',
        label: '정육·달걀',
      },
      {
        categoryId: 'seafood',
        label: '수산',
      },
      {
        categoryId: 'dairy',
        label: '유제품',
      },
      {
        categoryId: 'ready-meal',
        label: '간편식',
      },
      {
        categoryId: 'processed',
        label: '가공식품',
      },
      {
        categoryId: 'beverage',
        label: '음료·주류',
      },
      {
        categoryId: 'household',
        label: '생활용품',
      },
      {
        categoryId: 'etc',
        label: '기타',
      },
    ] satisfies EventDiscountCategoryFixtureTypes[],
    pages: [
      {
        hasNext: true,
        nextCursor: 309,
        products: [
          {
            categoryId: 'meat-egg',
            discountedPrice: 4900,
            name: '삼겹살 500G',
            productId: 301,
            thumbnailUrl: null,
          },
          {
            categoryId: 'meat-egg',
            discountedPrice: 4900,
            name: '삼겹살 500G',
            productId: 302,
            thumbnailUrl: null,
          },
          {
            categoryId: 'meat-egg',
            discountedPrice: 4900,
            name: '삼겹살 500G',
            productId: 303,
            thumbnailUrl: null,
          },
          {
            categoryId: 'vegetable-fruit',
            discountedPrice: 4900,
            name: '대추방울토마토 500G',
            productId: 304,
            thumbnailUrl: null,
          },
          {
            categoryId: 'vegetable-fruit',
            discountedPrice: 4900,
            name: '제주 감귤 1KG',
            productId: 305,
            thumbnailUrl: null,
          },
          {
            categoryId: 'processed',
            discountedPrice: 4900,
            name: '두부 300G',
            productId: 306,
            thumbnailUrl: null,
          },
          {
            categoryId: 'seafood',
            discountedPrice: 6900,
            name: '손질 고등어 1팩',
            productId: 307,
            thumbnailUrl: null,
          },
          {
            categoryId: 'processed',
            discountedPrice: 3900,
            name: '국산 콩나물 500G',
            productId: 308,
            thumbnailUrl: null,
          },
          {
            categoryId: 'vegetable-fruit',
            discountedPrice: 5900,
            name: '양파 1.5KG',
            productId: 309,
            thumbnailUrl: null,
          },
        ] satisfies EventDiscountProductFixtureTypes[],
      },
      {
        hasNext: false,
        nextCursor: null,
        products: [
          {
            categoryId: 'vegetable-fruit',
            discountedPrice: 3900,
            name: '양배추 1통',
            productId: 310,
            thumbnailUrl: null,
          },
          {
            categoryId: 'meat-egg',
            discountedPrice: 7900,
            name: '특란 30구',
            productId: 311,
            thumbnailUrl: null,
          },
          {
            categoryId: 'dairy',
            discountedPrice: 2800,
            name: '우유 900ML',
            productId: 312,
            thumbnailUrl: null,
          },
          {
            categoryId: 'seafood',
            discountedPrice: 5900,
            name: '손질 오징어 1마리',
            productId: 313,
            thumbnailUrl: null,
          },
          {
            categoryId: 'ready-meal',
            discountedPrice: 4500,
            name: '즉석 떡볶이',
            productId: 314,
            thumbnailUrl: null,
          },
          {
            categoryId: 'processed',
            discountedPrice: 3200,
            name: '라면 5입',
            productId: 315,
            thumbnailUrl: null,
          },
          {
            categoryId: 'beverage',
            discountedPrice: 1800,
            name: '생수 2L',
            productId: 316,
            thumbnailUrl: null,
          },
          {
            categoryId: 'household',
            discountedPrice: 6900,
            name: '세탁세제 1L',
            productId: 317,
            thumbnailUrl: null,
          },
          {
            categoryId: 'etc',
            discountedPrice: 2500,
            name: '주방 수세미',
            productId: 318,
            thumbnailUrl: null,
          },
        ] satisfies EventDiscountProductFixtureTypes[],
      },
    ] satisfies EventDiscountProductsPageFixtureTypes[],
  } satisfies EventDiscountProductsFixtureTypes,
} as const;
