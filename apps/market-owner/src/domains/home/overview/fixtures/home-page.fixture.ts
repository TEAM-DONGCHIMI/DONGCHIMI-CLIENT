import { type ProductCardItemTypes } from '@dongchimi/shared';

import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';

import {
  type HomeProductSectionTypes,
  type HomeShareTypes,
} from '../model/home-dashboard-view-model';

interface HomeHeroActionFixtureTypes {
  description: string;
  id: 'daily-registration' | 'periodic-registration' | 'product-edit';
  route: MarketOwnerRouteTypes;
  title: string;
}

const dailyProducts: ProductCardItemTypes[] = Array.from({ length: 6 }, (_, index) => ({
  discountRate: 10,
  id: String(101 + index),
  name: '풀무원 콩나물 500g',
  originalPriceText: '5,000원',
  priceText: '4,500원',
}));

const periodicProducts: ProductCardItemTypes[] = Array.from({ length: 6 }, (_, index) => ({
  id: String(201 + index),
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

export const homeProductSections: HomeProductSectionTypes[] = [
  {
    dealType: 'DAILY',
    editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
    id: 'daily',
    itemVariant: 'today',
    items: homeProductSummary.dailyProducts,
    title: '오늘의 특가 상품',
    totalCount: homeProductSummary.dailyCount,
  },
  {
    dealType: 'PERIODIC',
    editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
    id: 'periodic',
    itemVariant: 'period',
    items: homeProductSummary.periodicProducts,
    title: '행사 할인 상품',
    totalCount: homeProductSummary.periodicCount,
  },
] satisfies HomeProductSectionTypes[];

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

export const homeShare: HomeShareTypes = {
  copyUrl: 'https://app.dongchiimi.com/markets/mangwon-fresh',
  description: '카카오톡, 문자로 공유하거나 마트에 QR을 붙여보세요.',
  displayUrl: 'app.dongchiimi.com/markets/mangwon-fresh',
  flyer: {
    flyerId: 1,
    qrCode: 'QR코드 base64 이미지',
    slug: 'mangwon-fresh',
  },
  title: '전단 공유하기',
};
