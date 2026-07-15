import { queryOptions } from '@tanstack/react-query';

import { getDailyProducts, type DailyProductsParamsTypes } from '../api/daily-products-api';
import { dailyProductsQueryKeys } from '../query-keys';

export const dailyProductsQueryOptions = (params: DailyProductsParamsTypes) => {
  return queryOptions({
    queryKey: dailyProductsQueryKeys.query(params),
    queryFn: () => getDailyProducts(params),
  });
};
