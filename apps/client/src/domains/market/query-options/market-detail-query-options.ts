import { queryOptions } from '@tanstack/react-query';

import { getMarketDetail, type MarketDetailParamsTypes } from '../api/market-detail-api';
import { marketQueryKeys } from '../query-keys';

export const marketDetailQueryOptions = (params: MarketDetailParamsTypes) => {
  return queryOptions({
    queryKey: marketQueryKeys.detail(params),
    queryFn: () => getMarketDetail(params),
  });
};
