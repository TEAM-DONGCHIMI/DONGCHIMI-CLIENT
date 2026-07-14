import { API_ENDPOINTS } from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import { resolveMarketDetailResponse, type MarketDetailTypes } from '../model/market-detail-schema';

export type MarketDetailParamsTypes = Readonly<{
  slug: string;
}>;

export const getMarketDetail = async ({
  slug,
}: MarketDetailParamsTypes): Promise<MarketDetailTypes> => {
  const endpoint = API_ENDPOINTS.user.markets.detail(slug);
  const response = await httpClient.get<unknown>(endpoint);

  return resolveMarketDetailResponse(response);
};
