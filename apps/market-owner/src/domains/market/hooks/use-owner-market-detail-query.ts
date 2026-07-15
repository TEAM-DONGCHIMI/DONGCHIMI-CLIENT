import { useQuery } from '@tanstack/react-query';

import {
  ownerMarketDetailQueryOptions,
  type OwnerMarketDetailQueryParams,
} from '../query-options/owner-market-detail-query-options';

export const useOwnerMarketDetailQuery = (params: OwnerMarketDetailQueryParams) => {
  return useQuery(ownerMarketDetailQueryOptions(params));
};
