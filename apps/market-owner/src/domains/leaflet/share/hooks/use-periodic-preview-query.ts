import { useQuery } from '@tanstack/react-query';

import {
  periodicPreviewQueryOptions,
  type PeriodicPreviewQueryParamsTypes,
} from '../query-options';

export const usePeriodicPreviewQuery = (params: PeriodicPreviewQueryParamsTypes) => {
  return useQuery(periodicPreviewQueryOptions(params));
};
