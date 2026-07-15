import { useQuery } from '@tanstack/react-query';

import {
  preparedProductDraftsQueryOptions,
  type PreparedProductDraftsQueryParamsTypes,
} from '../query-options';

export const usePreparedProductDraftsQuery = (params: PreparedProductDraftsQueryParamsTypes) => {
  return useQuery(preparedProductDraftsQueryOptions(params));
};
