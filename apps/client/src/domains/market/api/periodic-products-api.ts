import { buildApiPath } from '@dongchimi/shared/api';

import { browserApi } from '@/shared/api';

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
  signal?: AbortSignal,
): Promise<PeriodicProductsPageTypes> => {
  const { category, cursor, marketId, size } = resolvePeriodicProductsParams(rawParams);
  const endpoint = buildApiPath('markets/products/periodic', {
    category,
    cursor,
    marketId,
    size,
  });
  const response = await browserApi.get<unknown>(endpoint, { signal });

  return resolvePeriodicProductsResponse(response, endpoint);
};
