import { queryOptions } from '@tanstack/react-query';

import { getDailyProducts, type DailyProductsParamsTypes } from '../api/daily-products-api';
import { marketQueryKeys } from '../query-keys';

export const dailyProductsQueryOptions = (params: DailyProductsParamsTypes) => {
  return queryOptions({
    queryKey: marketQueryKeys.dailyProducts(params),
    queryFn: ({ signal }) => getDailyProducts(params, signal),
  });
};
