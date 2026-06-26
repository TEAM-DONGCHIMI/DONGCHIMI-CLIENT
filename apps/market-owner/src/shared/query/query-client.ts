import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

import { HTTP_STATUS, isApiError } from '../api';

const QUERY_STALE_TIME_MS = 30_000;
const QUERY_GC_TIME_MS = 5 * 60_000;
const MAX_QUERY_RETRY_COUNT = 2;

const shouldRetryQuery = (failureCount: number, error: Error) => {
  if (failureCount >= MAX_QUERY_RETRY_COUNT) {
    return false;
  }

  if (isApiError(error)) {
    return error.status === undefined || error.status >= HTTP_STATUS.SERVER_ERROR;
  }

  return true;
};

export const queryClientDefaultOptions = {
  queries: {
    gcTime: QUERY_GC_TIME_MS,
    refetchOnWindowFocus: false,
    retry: shouldRetryQuery,
    staleTime: QUERY_STALE_TIME_MS,
  },
  mutations: {
    retry: false,
  },
} satisfies DefaultOptions;

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryClientDefaultOptions,
  });
};
