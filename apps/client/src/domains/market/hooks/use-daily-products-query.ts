'use client';

import { useQuery } from '@tanstack/react-query';

import { type DailyProductsParamsTypes } from '../api/daily-products-api';
import { dailyProductsQueryOptions } from '../query-options/daily-products-query-options';

const hasDailyProductsParams = ({ marketId }: DailyProductsParamsTypes) => {
  return Number.isInteger(marketId) && marketId > 0;
};

export const useDailyProductsQuery = (params: DailyProductsParamsTypes) => {
  return useQuery({
    ...dailyProductsQueryOptions(params),
    enabled: hasDailyProductsParams(params),
  });
};
