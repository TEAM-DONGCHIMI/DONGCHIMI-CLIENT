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

export interface MarketShareFixtureTypes {
  marketId: number;
  marketName: string;
  qrCode: string;
  slug: string;
}

export const DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT = 2;
export const DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT = 2;

const todaySpecialProducts = [
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
] satisfies TodaySpecialProductFixtureTypes[];

export const marketProductsFixture = {
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
    products: todaySpecialProducts,
    totalCount: todaySpecialProducts.length,
  } satisfies TodaySpecialProductsFixtureTypes,
} as const;
