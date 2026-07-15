import type { DailyProductsParamsTypes } from './api/daily-products-api';
import type { MarketDetailParamsTypes } from './api/market-detail-api';
import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';
import type { PeriodicProductsListParamsTypes } from './api/periodic-products-api';
import type { ProductDetailParamsTypes } from './api/product-detail-api';
import { DEFAULT_PERIODIC_PRODUCTS_PAGE_SIZE } from './model/periodic-products-schema';

const normalizePeriodicProductsParams = ({
  category,
  marketId,
  size = DEFAULT_PERIODIC_PRODUCTS_PAGE_SIZE,
}: PeriodicProductsListParamsTypes) => ({
  category,
  marketId,
  size,
});

const normalizeProductDetailParams = ({ marketId, productId }: ProductDetailParamsTypes) => {
  return {
    marketId,
    productId,
  } satisfies ProductDetailParamsTypes;
};

const normalizeNearbyMarketsListParams = ({
  lat,
  lng,
  radius,
  size,
}: NearbyMarketsListParamsTypes): Partial<
  Pick<NearbyMarketsListParamsTypes, 'lat' | 'lng' | 'radius' | 'size'>
> => {
  return Object.fromEntries(
    Object.entries({
      lat,
      lng,
      radius,
      size,
    }).filter(([, value]) => value !== undefined),
  ) satisfies Partial<Pick<NearbyMarketsListParamsTypes, 'lat' | 'lng' | 'radius' | 'size'>>;
};

export const marketQueryKeys = {
  all: ['market'] as const,
  detail: (params: MarketDetailParamsTypes) =>
    [...marketQueryKeys.all, 'market-detail', params] as const,
  nearbyList: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', normalizeNearbyMarketsListParams(params)] as const,
  nearbyMarkers: (params: NearbyMarketsListParamsTypes) =>
    [
      ...marketQueryKeys.all,
      'nearby-markets',
      'markers',
      normalizeNearbyMarketsListParams(params),
    ] as const,
  products: () => [...marketQueryKeys.all, 'products'] as const,
  dailyProducts: (params: DailyProductsParamsTypes) =>
    [...marketQueryKeys.products(), 'daily', params] as const,
  periodicProducts: (params: PeriodicProductsListParamsTypes) =>
    [...marketQueryKeys.products(), 'periodic', normalizePeriodicProductsParams(params)] as const,
  productDetailRoot: () => [...marketQueryKeys.all, 'products', 'detail'] as const,
  productDetail: (params: ProductDetailParamsTypes) =>
    [...marketQueryKeys.productDetailRoot(), normalizeProductDetailParams(params)] as const,
};
