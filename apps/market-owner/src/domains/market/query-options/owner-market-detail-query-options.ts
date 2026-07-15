import { queryOptions } from '@tanstack/react-query';

import { getOwnerMarketDetail } from '../api/get-owner-market-detail';
import { marketQueryKeys } from '../query-keys';

export interface OwnerMarketDetailQueryParams {
  marketId?: number;
}

export const ownerMarketDetailQueryOptions = ({ marketId }: OwnerMarketDetailQueryParams) => {
  return queryOptions({
    enabled: marketId != null,
    queryKey: marketQueryKeys.detail(marketId),
    queryFn: () => {
      if (marketId == null) {
        throw new Error('Owner market detail marketId is required.');
      }

      return getOwnerMarketDetail(marketId);
    },
    throwOnError: false,
  });
};
