import { type ProductCardItemTypes, type ProductCardProps } from '@dongchimi/shared';

import { type OwnerHomeResponseTypes } from '@/domains/home/model/owner-home-schema';
import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';

export interface HomeProductSectionTypes {
  editRoute: MarketOwnerRouteTypes;
  id: string;
  itemVariant: NonNullable<ProductCardProps['itemVariant']>;
  items: ProductCardItemTypes[];
  title: string;
  totalCount: number;
}

interface HomeFlyerTypes {
  flyerId: number;
  qrCode?: string | null;
  slug: string;
}

export interface HomeShareTypes {
  copyUrl: string;
  description: string;
  displayUrl: string;
  flyer: HomeFlyerTypes | null;
  title: string;
}

const SHARE_URL_HOST = 'dongchimi.kr';

const formatPrice = (price: number) => {
  return `${price.toLocaleString('ko-KR')}원`;
};

const createTodayProductItem = (product: OwnerHomeResponseTypes['dailyProducts'][number]) => {
  return {
    discountRate: product.discountRate,
    id: String(product.productId),
    imageUrl: product.thumbnailUrl ?? undefined,
    name: product.name,
    originalPriceText: formatPrice(product.originalPrice),
    priceText: formatPrice(product.discountedPrice),
  } satisfies ProductCardItemTypes;
};

const createPeriodicProductItem = (
  product: OwnerHomeResponseTypes['periodicProducts'][number],
  index: number,
) => {
  return {
    id: String(product.productId),
    imageUrl: product.thumbnailUrl ?? undefined,
    name: product.name,
    priceText: formatPrice(product.discountedPrice),
    rank: index + 1,
  } satisfies ProductCardItemTypes;
};

export const createHomeDashboardViewModel = (data: OwnerHomeResponseTypes) => {
  const flyer = data.flyer ?? null;
  const displayUrl = flyer ? `${SHARE_URL_HOST}/${flyer.slug}` : '';

  return {
    sections: [
      {
        editRoute: MARKET_OWNER_ROUTES.todaySpecialEdit,
        id: 'daily',
        itemVariant: 'today',
        items: data.dailyProducts.map(createTodayProductItem),
        title: '오늘의 특가 상품',
        totalCount: data.dailyCount,
      },
      {
        editRoute: MARKET_OWNER_ROUTES.eventDiscountEdit,
        id: 'periodic',
        itemVariant: 'period',
        items: data.periodicProducts.map(createPeriodicProductItem),
        title: '행사 할인 상품',
        totalCount: data.periodicCount,
      },
    ] satisfies HomeProductSectionTypes[],
    share: {
      copyUrl: displayUrl ? `https://${displayUrl}` : '',
      description: '카카오톡, 문자로 공유하거나 마트에 QR을 붙여보세요.',
      displayUrl,
      flyer,
      title: '전단 공유하기',
    } satisfies HomeShareTypes,
  };
};
