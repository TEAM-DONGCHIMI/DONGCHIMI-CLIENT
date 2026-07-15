import { infiniteQueryOptions, type InfiniteData } from '@tanstack/react-query';

import {
  getPeriodicProducts,
  type PeriodicProductsListParamsTypes,
} from '../api/periodic-products-api';
import type { PeriodicProductsPageTypes } from '../model/periodic-products-schema';
import { marketQueryKeys } from '../query-keys';

type PeriodicProductsQueryKeyTypes = ReturnType<typeof marketQueryKeys.periodicProducts>;

export const getPeriodicProductsNextPageParam = (lastPage: PeriodicProductsPageTypes) => {
  if (!lastPage.hasNext || lastPage.nextCursor == null) {
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
    getNextPageParam: getPeriodicProductsNextPageParam,
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam, signal }) =>
      getPeriodicProducts({ ...params, cursor: pageParam }, signal),
    queryKey: marketQueryKeys.periodicProducts(params),
  });
};
