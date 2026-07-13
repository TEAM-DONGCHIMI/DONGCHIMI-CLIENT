import { httpClient } from '@/shared/api';

import { resolveMarketDetailResponse, type MarketDetailTypes } from '../model/market-detail-schema';

export type MarketDetailParamsTypes = Readonly<{
  slug: string;
}>;

const getMarketDetailProxyPath = (slug: string) => `/api/markets/${encodeURIComponent(slug)}`;

export const getMarketDetail = async ({
  slug,
}: MarketDetailParamsTypes): Promise<MarketDetailTypes> => {
  const response = await httpClient.get<unknown>(getMarketDetailProxyPath(slug));

  return resolveMarketDetailResponse(response);
};
