import { infiniteQueryOptions, type InfiniteData } from '@tanstack/react-query';

import {
  getPeriodicProducts,
  type PeriodicProductsListParamsTypes,
} from '../api/periodic-products-api';
import type { PeriodicProductsPageTypes } from '../model/periodic-products-schema';
import { marketQueryKeys } from '../query-keys';

type PeriodicProductsQueryKeyTypes = ReturnType<typeof marketQueryKeys.periodicProducts>;

export const PERIODIC_PRODUCTS_INACTIVE_CACHE_TIME_MS = 30 * 60 * 1000;

export const getPeriodicProductsNextPageParam = (
  lastPage: PeriodicProductsPageTypes,
  _allPages: PeriodicProductsPageTypes[],
  _lastPageParam: number | undefined,
  allPageParams: (number | undefined)[],
) => {
  if (!lastPage.hasNext || lastPage.nextCursor == null) {
    return undefined;
  }

  if (allPageParams.includes(lastPage.nextCursor)) {
    return undefined;
  }

  return lastPage.nextCursor;
};

export const periodicProductsInfiniteQueryOptions = (params: PeriodicProductsListParamsTypes) => {
  return infiniteQueryOptions<
    PeriodicProductsPageTypes,
    Error,
    InfiniteData<PeriodicProductsPageTypes, number | undefined>,
    PeriodicProductsQueryKeyTypes,
    number | undefined
  >({
    gcTime: PERIODIC_PRODUCTS_INACTIVE_CACHE_TIME_MS,
    getNextPageParam: getPeriodicProductsNextPageParam,
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam, signal }) =>
      getPeriodicProducts({ ...params, cursor: pageParam }, signal),
    queryKey: marketQueryKeys.periodicProducts(params),
  });
};
