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

let cachedBrowserApi: KyInstance | undefined;

export const createBrowserApi = () => {
  return ky.create({
    credentials: 'include',
    prefix: new URL('/api/', window.location.origin).toString(),
    retry: {
      limit: 0,
    },
    timeout: REQUEST_TIMEOUT_MS,
    hooks: {
      beforeRequest: [
        ({ request }) => {
          request.headers.set('Accept', 'application/json');
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
