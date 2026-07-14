import { API_ENDPOINTS } from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import {
  resolveMarketDetailParams,
  resolveMarketDetailResponse,
  type MarketDetailParamsTypes,
  type MarketDetailTypes,
} from '../model/market-detail-schema';

export type { MarketDetailParamsTypes } from '../model/market-detail-schema';

export const getMarketDetail = async (
  rawParams: MarketDetailParamsTypes,
): Promise<MarketDetailTypes> => {
  const { slug } = resolveMarketDetailParams(rawParams);
  const endpoint = API_ENDPOINTS.user.markets.detail(slug);
  const response = await httpClient.get<unknown>(endpoint);

  return resolveMarketDetailResponse(response);
};
