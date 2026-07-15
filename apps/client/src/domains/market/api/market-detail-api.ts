import { browserApi } from '@/shared/api';

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
  const response = await browserApi.get<unknown>(`markets/${encodeURIComponent(slug)}`);

  return resolveMarketDetailResponse(response);
};
