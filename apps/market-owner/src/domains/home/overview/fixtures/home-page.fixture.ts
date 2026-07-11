import { type ProductCardItemTypes, type ProductCardProps } from '@dongchimi/shared';

import { type ProductSearchPanelItemTypes } from '@/shared/components';
import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';

export interface HomeProductSectionFixtureTypes {
  editRoute: MarketOwnerRouteTypes;
  id: string;
  itemVariant: NonNullable<ProductCardProps['itemVariant']>;
  items: ProductCardItemTypes[];
  title: string;
  totalCount: number;
}

interface HomeHeroActionFixtureTypes {
  description: string;
  id: string;
  route: MarketOwnerRouteTypes;
  title: string;
}

interface HomeSearchProductFixtureTypes extends ProductSearchPanelItemTypes {
  editRoute: MarketOwnerRouteTypes;
  isProductInfoLoadable?: boolean;
}

interface HomeFlyerFixtureTypes {
  flyerId: number;
  qrCode: string;
  slug: string;
}

export interface HomeShareFixtureTypes {
  description: string;
  flyer: HomeFlyerFixtureTypes | null;
  title: string;
  url: string;
}

const normalizeSearchText = (value: string) => value.toLocaleLowerCase('ko-KR').replace(/\s+/g, '');

const dailyProducts: ProductCardItemTypes[] = Array.from({ length: 6 }, (_, index) => ({
  discountRate: 10,
  id: `daily-product-${index + 1}`,
  name: '풀무원 콩나물 500g',
  originalPriceText: '5,000원',
  priceText: '4,500원',
}));

const periodicProducts: ProductCardItemTypes[] = Array.from({ length: 6 }, (_, index) => ({
  id: `periodic-product-${index + 1}`,
  name: '풀무원 콩나물 500g',
  priceText: '5,000원',
  rank: index + 1,
}));

export const homeProductSummary = {
  dailyCount: 20,
  dailyProducts,
  periodicCount: 35,
  periodicProducts,
} as const;

export const homeSearchProducts: HomeSearchProductFixtureTypes[] = [
  {
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'search-daily-tofu',
    isProductInfoLoadable: false,
    label: '오늘의 특가',
    name: '풀무원 두부 1팩',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'search-daily-bean-sprout',
    label: '오늘의 특가',
    name: '풀무원 콩나물 100g',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'search-periodic-pool-forest',
    label: '행사 할인',
    name: '풀숲',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'search-periodic-pool',
    label: '행사 할인',
    name: '풀풀풀',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'search-daily-soft-tofu',
    label: '오늘의 특가',
    name: '풀무원 순두부 350g',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'search-periodic-tofu-set',
    label: '행사 할인',
    name: '풀무원 두부 세트',
  },
] satisfies HomeSearchProductFixtureTypes[];

export const getHomeSearchProductsByQuery = (query: string) => {
  const normalizedQuery = normalizeSearchText(query);

  if (normalizedQuery.length === 0) {
    return [];
  }

  return homeSearchProducts.filter((product) =>
    normalizeSearchText(`${product.label}${product.name}`).includes(normalizedQuery),
  );
};

export const homeProductSections: HomeProductSectionFixtureTypes[] = [
  {
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'daily',
    itemVariant: 'today',
    items: homeProductSummary.dailyProducts,
    title: '오늘의 특가 상품',
    totalCount: homeProductSummary.dailyCount,
  },
  {
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'periodic',
    itemVariant: 'period',
    items: homeProductSummary.periodicProducts,
    title: '행사 할인 상품',
    totalCount: homeProductSummary.periodicCount,
  },
] satisfies HomeProductSectionFixtureTypes[];

export const homeHeroActions: HomeHeroActionFixtureTypes[] = [
  {
    description: '오늘만 진행하는 특가 상품을 등록해요.',
    id: 'daily-registration',
    route: MARKET_OWNER_ROUTES.todaySpecialRegistration,
    title: '오늘의 특가 상품 등록하기',
  },
  {
    description: '행사 기간 동안 판매할 할인 상품을 등록해요.',
    id: 'periodic-registration',
    route: MARKET_OWNER_ROUTES.eventDiscountRegistration,
    title: '행사 할인 상품 등록하기',
  },
  {
    description: '등록한 상품 정보를 수정해요.',
    id: 'product-edit',
    route: MARKET_OWNER_ROUTES.todaySpecialEdit,
    title: '상품 수정하러 가기',
  },
] satisfies HomeHeroActionFixtureTypes[];

export const homeShare: HomeShareFixtureTypes = {
  description: '카카오톡, 문자로 공유하거나 마트에 QR을 붙여보세요.',
  flyer: {
    flyerId: 1,
    qrCode: 'QR코드 base64 이미지',
    slug: 'mangwon-fresh',
  },
  title: '전단 공유하기',
  url: 'dongchimi.kr/mangwon-fresh',
};
