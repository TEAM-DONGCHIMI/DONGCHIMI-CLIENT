import { MutationCache, QueryCache, QueryClient, type DefaultOptions } from '@tanstack/react-query';

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

const handleQueryError = () => {
  // TODO: 공통 query 실패 처리 정책이 정해지면 toast 또는 Sentry capture를 연결합니다.
};

const handleMutationError = () => {
  // TODO: 공통 mutation 실패 처리 정책이 정해지면 toast 또는 Sentry capture를 연결합니다.
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
    queryCache: new QueryCache({
      onError: handleQueryError,
    }),
    mutationCache: new MutationCache({
      onError: handleMutationError,
    }),
    defaultOptions: queryClientDefaultOptions,
  });
};
