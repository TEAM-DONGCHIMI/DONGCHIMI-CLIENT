'use client';

import { useQuery } from '@tanstack/react-query';

import { type MarketDetailParamsTypes } from '../api/market-detail-api';
import { marketDetailQueryOptions } from '../query-options/market-detail-query-options';

const hasMarketDetailParams = ({ slug }: MarketDetailParamsTypes) => {
  return slug.length > 0;
};

export const useMarketDetailQuery = (params: MarketDetailParamsTypes) => {
  return useQuery({
    ...marketDetailQueryOptions(params),
    enabled: hasMarketDetailParams(params),
  });
};
