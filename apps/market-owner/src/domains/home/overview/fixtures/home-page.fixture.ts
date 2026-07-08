import { type ProductCardItemTypes, type ProductCardProps } from '@dongchimi/shared';

import { type ProductSearchPanelItemTypes } from '@/shared/components';
import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';

interface HomeProductSectionFixtureTypes {
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

const todaySpecialProducts: ProductCardItemTypes[] = Array.from({ length: 6 }, (_, index) => ({
  discountRate: 10,
  id: `today-special-product-${index + 1}`,
  name: '풀무원 콩나물 500g',
  originalPriceText: '5,000원',
  priceText: '4,500원',
}));

const eventDiscountProducts: ProductCardItemTypes[] = Array.from({ length: 6 }, (_, index) => ({
  id: `event-discount-product-${index + 1}`,
  name: '풀무원 콩나물 500g',
  priceText: '5,000원',
  rank: index + 1,
}));

export const homeSearchProducts: HomeSearchProductFixtureTypes[] = [
  {
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'search-today-tofu',
    isProductInfoLoadable: false,
    label: '오늘의 특가',
    name: '풀무원 두부 1팩',
    registeredAt: '2026-07-08T07:30:00.000Z',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'search-today-bean-sprout',
    label: '오늘의 특가',
    name: '풀무원 콩나물 100g',
    registeredAt: '2026-07-08T07:00:00.000Z',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'search-event-pool-forest',
    label: '행사 할인',
    name: '풀숲',
    registeredAt: '2026-07-08T06:30:00.000Z',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'search-event-pool',
    label: '행사 할인',
    name: '풀풀풀',
    registeredAt: '2026-07-08T06:00:00.000Z',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'search-today-soft-tofu',
    label: '오늘의 특가',
    name: '풀무원 순두부 350g',
    registeredAt: '2026-07-08T05:30:00.000Z',
  },
  {
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'search-event-tofu-set',
    label: '행사 할인',
    name: '풀무원 두부 세트',
    registeredAt: '2026-07-08T05:00:00.000Z',
  },
] satisfies HomeSearchProductFixtureTypes[];

export const homeProductSections: HomeProductSectionFixtureTypes[] = [
  {
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'today-special',
    itemVariant: 'today',
    items: todaySpecialProducts,
    title: '오늘의 특가 상품',
    totalCount: 20,
  },
  {
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'event-discount',
    itemVariant: 'period',
    items: eventDiscountProducts,
    title: '행사 할인 상품',
    totalCount: 35,
  },
] satisfies HomeProductSectionFixtureTypes[];

export const homeHeroActions: HomeHeroActionFixtureTypes[] = [
  {
    description: '오늘만 진행하는 특가 상품을 등록해요.',
    id: 'today-special-registration',
    route: MARKET_OWNER_ROUTES.todaySpecialRegistration,
    title: '오늘의 특가 상품 등록하기',
  },
  {
    description: '행사 기간 동안 판매할 할인 상품을 등록해요.',
    id: 'event-discount-registration',
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

export const homeShare = {
  description: '카카오톡, 문자로 공유하거나 마트에 QR을 붙여보세요.',
  title: '전단 공유하기',
  url: 'dongchimi.kr/mangwon-fresh',
} as const;
