import { queryOptions } from '@tanstack/react-query';

import { getPeriodicPreview } from './api';
import { leafletShareQueryKeys } from './query-keys';

export interface PeriodicPreviewQueryParamsTypes {
  marketId?: number | null;
}

export const periodicPreviewQueryOptions = ({ marketId }: PeriodicPreviewQueryParamsTypes) => {
  return queryOptions({
    enabled: marketId != null,
    queryKey: leafletShareQueryKeys.periodicPreview(marketId ?? 'missing-market'),
    queryFn: () => {
      if (marketId == null) {
        throw new Error('Periodic preview marketId is required.');
      }

      return getPeriodicPreview(marketId);
    },
    throwOnError: false,
  });
};
