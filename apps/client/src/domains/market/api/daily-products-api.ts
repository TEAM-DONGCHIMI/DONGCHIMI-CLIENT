import { buildApiPath } from '@dongchimi/shared/api';

import { browserApi } from '@/shared/api';

import {
  resolveDailyProductsParams,
  resolveDailyProductsResponse,
  type DailyProductsParamsTypes,
  type DailyProductsTypes,
} from '../model/daily-products-schema';

export type { DailyProductsParamsTypes } from '../model/daily-products-schema';

export const getDailyProducts = async (
  rawParams: DailyProductsParamsTypes,
  signal?: AbortSignal,
): Promise<DailyProductsTypes> => {
  const { marketId } = resolveDailyProductsParams(rawParams);
  const endpoint = buildApiPath('markets/products/daily', { marketId });
  const response = await browserApi.get<unknown>(endpoint, { signal });

  return resolveDailyProductsResponse(response, endpoint);
};
