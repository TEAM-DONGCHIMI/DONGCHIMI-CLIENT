'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { PeriodicProductsListParamsTypes } from '../api/periodic-products-api';
import { periodicProductsInfiniteQueryOptions } from '../query-options/periodic-products-infinite-query-options';

const hasPeriodicProductsParams = ({ marketId, size }: PeriodicProductsListParamsTypes) => {
  return (
    Number.isInteger(marketId) &&
    marketId > 0 &&
    (size === undefined || (Number.isInteger(size) && size > 0 && size <= 60))
  );
};

export const usePeriodicProductsInfiniteQuery = (params: PeriodicProductsListParamsTypes) => {
  return useInfiniteQuery({
    ...periodicProductsInfiniteQueryOptions(params),
    enabled: hasPeriodicProductsParams(params),
  });
};
