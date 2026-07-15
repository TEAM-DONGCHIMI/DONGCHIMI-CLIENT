import { QueryClient, type DefaultOptions } from '@tanstack/react-query';
import { isApiResponseValidationError } from '@dongchimi/shared/api';

import { isApiError } from '@/shared/api';

const DEFAULT_STALE_TIME_MS = 30_000;
const MAX_QUERY_RETRY_COUNT = 2;

const shouldRetryQuery = (failureCount: number, error: Error) => {
  if (failureCount >= MAX_QUERY_RETRY_COUNT) {
    return false;
  }

  if (isApiError(error) && (error.type === 'auth' || error.type === 'validation')) {
    return false;
  }

  if (isApiResponseValidationError(error)) {
    return false;
  }

  return true;
};

export const queryClientDefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: shouldRetryQuery,
    staleTime: DEFAULT_STALE_TIME_MS,
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
