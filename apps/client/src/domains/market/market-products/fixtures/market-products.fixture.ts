export type BusinessDayTypes =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type BusinessHourTypes =
  | {
      close: string;
      days: BusinessDayTypes[];
      isOpen: true;
      open: string;
    }
  | {
      days: BusinessDayTypes[];
      isOpen: false;
    };

export interface TopProductFixtureTypes {
  discountedPrice: number;
  discountRate: number;
  name: string;
  productId: number;
  thumbnailUrl: string | null;
}

export interface TodaySpecialProductFixtureTypes {
  discountedPrice: number;
  discountRate: number;
  name: string;
  originalPrice: number;
  productId: number;
  thumbnailUrl: string | null;
}

export interface TodaySpecialProductsFixtureTypes {
  products: TodaySpecialProductFixtureTypes[];
  totalCount: number;
}

export interface EventDiscountProductFixtureTypes {
  categoryId: string;
  discountedPrice: number;
  name: string;
  productId: number;
  thumbnailUrl: string | null;
}

export interface EventDiscountProductsFixtureTypes {
  hasNext: boolean;
  nextCursor: number | null;
  products: EventDiscountProductFixtureTypes[];
}

export interface EventDiscountCategoryFixtureTypes {
  categoryId: string;
  label: string;
}

export interface MarketShareFixtureTypes {
  marketId: number;
  marketName: string;
  qrCode: string;
  slug: string;
}

export const DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT = 2;
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
  } satisfies EventDiscountProductsFixtureTypes & {
    categories: EventDiscountCategoryFixtureTypes[];
  },
  market: {
    address: '서울 마포구 망원동',
    businessHours: [
      {
        close: '20:00',
        days: ['TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        isOpen: true,
        open: '10:00',
      },
      {
        close: '20:00',
        days: ['SATURDAY', 'SUNDAY'],
        isOpen: true,
        open: '12:00',
      },
      {
        days: ['MONDAY'],
        isOpen: false,
      },
    ] satisfies BusinessHourTypes[],
    isOpenNow: true,
    marketId: 1,
    marketPhone1: '02-123-4567',
    marketPhone2: '02-123-2345',
    name: '망원 신선마트',
    ownerPhone: '02-123-1234',
    thumbnailUrl: null,
    top3: [
      {
        discountedPrice: 6900,
        discountRate: 10,
        name: '삼겹살 500g',
        productId: 101,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 6900,
        discountRate: 10,
        name: '삼겹살 500g',
        productId: 102,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 6900,
        discountRate: 10,
        name: '삼겹살 500g',
        productId: 103,
        thumbnailUrl: null,
      },
    ] satisfies TopProductFixtureTypes[],
  },
  share: {
    marketId: 1,
    marketName: '망원 신선마트',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    slug: 'mangwon-fresh',
  } satisfies MarketShareFixtureTypes,
  todaySpecial: {
    products: [
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 201,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 202,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 203,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 204,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 205,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 206,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 207,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 208,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 4500,
        discountRate: 10,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 209,
        thumbnailUrl: null,
      },
    ] satisfies TodaySpecialProductFixtureTypes[],
    totalCount: 30,
  } satisfies TodaySpecialProductsFixtureTypes,
} as const;
