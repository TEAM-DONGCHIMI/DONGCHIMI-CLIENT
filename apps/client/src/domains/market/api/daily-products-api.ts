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
): Promise<DailyProductsTypes> => {
  const { marketId } = resolveDailyProductsParams(rawParams);
  const endpoint = `markets/${marketId}/products/daily`;
  const response = await browserApi.get<unknown>(endpoint);

  return resolveDailyProductsResponse(response, endpoint);
};
