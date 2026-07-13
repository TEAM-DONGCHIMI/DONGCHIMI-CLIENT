import { queryOptions } from '@tanstack/react-query';

import { getMarketDetail, type MarketDetailParamsTypes } from '../api/market-detail-api';
import { marketDetailQueryKeys } from '../query-keys';

export const marketDetailQueryOptions = (params: MarketDetailParamsTypes) => {
  return queryOptions({
    queryKey: marketDetailQueryKeys.query(params),
    queryFn: () => getMarketDetail(params),
  });
};
