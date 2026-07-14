import { MARKET_OWNER_ROUTES, MARKET_OWNER_ROUTE_SEARCH_PARAMS } from '@/shared/constants/routes';

export type ProductEditTargetDealTypes = 'DAILY' | 'PERIODIC';

export interface ProductEditTargetTypes {
  dealType: ProductEditTargetDealTypes;
  productId: number | string;
}

const productEditRouteByDealType = {
  DAILY: MARKET_OWNER_ROUTES.todaySpecialEdit,
  PERIODIC: MARKET_OWNER_ROUTES.eventDiscountEdit,
} satisfies Record<ProductEditTargetDealTypes, string>;

export const createProductEditTargetPath = ({ dealType, productId }: ProductEditTargetTypes) => {
  const searchParams = new URLSearchParams({
    [MARKET_OWNER_ROUTE_SEARCH_PARAMS.productEditTargetProductId]: String(productId),
  });

  return `${productEditRouteByDealType[dealType]}?${searchParams.toString()}`;
};
