import ky, { type KyInstance, type Options } from 'ky';

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

let cachedBrowserApi: KyInstance | undefined;
let refreshSessionPromise: Promise<boolean> | undefined;

const refreshSession = () => {
  refreshSessionPromise ??= ky
    .post(new URL(AUTH_REFRESH_PATH, window.location.origin), {
      credentials: 'include',
      retry: 0,
      throwHttpErrors: false,
    })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshSessionPromise = undefined;
    });

  return refreshSessionPromise;
};

export const createBrowserApi = () => {
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

          if (response.status !== 401 || retryCount > 0 || isAuthRequest) {
            return response;
          }

          const isSessionRefreshed = await refreshSession();

          if (!isSessionRefreshed) {
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
