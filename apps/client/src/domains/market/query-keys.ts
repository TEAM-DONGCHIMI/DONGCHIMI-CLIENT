import type { DailyProductsParamsTypes } from './api/daily-products-api';
import type { MarketDetailParamsTypes } from './api/market-detail-api';
import type { NearbyMarketsListParamsTypes } from './api/nearby-markets-api';

export const marketQueryKeys = {
  all: ['market'] as const,
  detail: (params: MarketDetailParamsTypes) =>
    [...marketQueryKeys.all, 'market-detail', params] as const,
  nearbyList: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', params] as const,
  nearbyMarkers: (params: NearbyMarketsListParamsTypes) =>
    [...marketQueryKeys.all, 'nearby-markets', 'markers', params] as const,
  products: () => [...marketQueryKeys.all, 'products'] as const,
  dailyProducts: (params: DailyProductsParamsTypes) =>
    [...marketQueryKeys.products(), 'daily', params] as const,
};
