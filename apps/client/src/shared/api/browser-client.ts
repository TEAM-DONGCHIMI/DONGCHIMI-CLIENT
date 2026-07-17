import ky, { type KyInstance, type Options } from 'ky';

import { redirectToLoginForAuthRequired } from '@/shared/auth/auth-required-redirect';

import { normalizeApiError } from './api-error';

type HttpMethodTypes = 'delete' | 'get' | 'patch' | 'post' | 'put';

type HttpRequestTypes = <ResponseDataTypes>(
  path: string,
  options?: Options,
) => Promise<ResponseDataTypes>;

type BrowserApiTypes = Record<HttpMethodTypes, HttpRequestTypes> & {
  request: HttpRequestTypes;
};

const REQUEST_TIMEOUT_MS = 10_000;
const AUTH_API_PATH_PREFIX = '/api/auth/';
const AUTH_REFRESH_PATH = '/api/auth/token/refresh';
const AUTH_REFRESH_LOCK_NAME = 'dongchimi:client-auth-refresh';

type RefreshSessionResultTypes = 'refreshed' | 'unavailable' | 'unauthenticated';

let cachedBrowserApi: KyInstance | undefined;
let refreshSessionPromise: Promise<RefreshSessionResultTypes> | undefined;

export interface CreateBrowserApiOptions {
  onFinalUnauthorized?: () => Promise<void> | void;
}

const requestRefreshSession = () => {
  return ky
    .post(new URL(AUTH_REFRESH_PATH, window.location.origin), {
      credentials: 'include',
      retry: 0,
      throwHttpErrors: false,
    })
    .then((response): RefreshSessionResultTypes => {
      if (response.ok) {
        return 'refreshed';
      }

      return response.status === 401 ? 'unauthenticated' : 'unavailable';
    })
    .catch((): RefreshSessionResultTypes => 'unavailable');
};

const requestRefreshSessionWithLock = async () => {
  if (typeof navigator === 'undefined' || !navigator.locks) {
    return await requestRefreshSession();
  }

  return await navigator.locks.request<Promise<RefreshSessionResultTypes>>(
    AUTH_REFRESH_LOCK_NAME,
    requestRefreshSession,
  );
};

const refreshSession = () => {
  refreshSessionPromise ??= requestRefreshSessionWithLock().finally(() => {
    refreshSessionPromise = undefined;
  });

  return refreshSessionPromise;
};

export const createBrowserApi = (options: CreateBrowserApiOptions = {}) => {
  const onFinalUnauthorized = options.onFinalUnauthorized ?? redirectToLoginForAuthRequired;
  let authRedirectPromise: Promise<void> | undefined;

  const notifyFinalUnauthorized = () => {
    if (!authRedirectPromise) {
      const redirectPromise = Promise.resolve().then(() => onFinalUnauthorized());
      const clearRedirectPromise = () => {
        if (authRedirectPromise === redirectPromise) {
          authRedirectPromise = undefined;
        }
      };

      authRedirectPromise = redirectPromise;
      void redirectPromise.then(clearRedirectPromise, clearRedirectPromise);
    }

    return authRedirectPromise;
  };

  return ky.create({
    credentials: 'include',
    prefix: new URL('/api/', window.location.origin).toString(),
    retry: {
      limit: 1,
      methods: [],
      statusCodes: [],
    },
    timeout: REQUEST_TIMEOUT_MS,
    hooks: {
      beforeRequest: [
        ({ request }) => {
          request.headers.set('Accept', 'application/json');
        },
      ],
      afterResponse: [
        async ({ request, response, retryCount }) => {
          const isAuthRequest = new URL(request.url).pathname.startsWith(AUTH_API_PATH_PREFIX);

          if (response.status !== 401 || isAuthRequest) {
            return response;
          }

          if (retryCount > 0) {
            await notifyFinalUnauthorized();

            return response;
          }

          const refreshResult = await refreshSession();

          if (refreshResult === 'unauthenticated') {
            await notifyFinalUnauthorized();

            return response;
          }

          if (refreshResult === 'unavailable') {
            return response;
          }

          return ky.retry({
            code: 'AUTH_SESSION_REFRESHED',
          });
        },
      ],
    },
  });
};

export const getBrowserApi = () => {
  cachedBrowserApi ??= createBrowserApi();

  return cachedBrowserApi;
};

const request = async <ResponseDataTypes>(path: string, options?: Options) => {
  try {
    return await getBrowserApi()<ResponseDataTypes>(path, options).json();
  } catch (error) {
    throw await normalizeApiError(error);
  }
};

const withMethod = (method: HttpMethodTypes) => {
  return <ResponseDataTypes>(path: string, options?: Options) => {
    return request<ResponseDataTypes>(path, { ...options, method });
  };
};

export const browserApi: BrowserApiTypes = {
  delete: withMethod('delete'),
  get: withMethod('get'),
  patch: withMethod('patch'),
  post: withMethod('post'),
  put: withMethod('put'),
  request,
};
