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
  todaySpecial: {
    products: todaySpecialProducts,
    totalCount: todaySpecialProducts.length,
  } satisfies TodaySpecialProductsFixtureTypes,
} as const;
