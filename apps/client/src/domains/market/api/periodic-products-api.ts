import { API_ENDPOINTS } from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import {
  resolvePeriodicProductsParams,
  resolvePeriodicProductsResponse,
  type PeriodicProductsListParamsTypes,
  type PeriodicProductsPageTypes,
  type PeriodicProductsParamsTypes,
} from '../model/periodic-products-schema';

export type { PeriodicProductsListParamsTypes, PeriodicProductsParamsTypes };

export const getPeriodicProducts = async (
  rawParams: PeriodicProductsParamsTypes,
): Promise<PeriodicProductsPageTypes> => {
  const { category, cursor, marketId, size } = resolvePeriodicProductsParams(rawParams);
  const endpoint = API_ENDPOINTS.user.products.periodic(marketId, {
    category,
    cursor,
    size,
  });
  const response = await httpClient.get<unknown>(endpoint);

  return resolvePeriodicProductsResponse(response, endpoint);
};
