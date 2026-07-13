import ky, { type KyInstance, type Options } from 'ky';

import { createApiConfigurationError, normalizeApiError } from './api-error';

type HttpMethodTypes = 'delete' | 'get' | 'patch' | 'post' | 'put';

type HttpRequestTypes = <ResponseDataTypes>(
  path: string,
  options?: Options,
) => Promise<ResponseDataTypes>;

type HttpClientTypes = Record<HttpMethodTypes, HttpRequestTypes> & {
  request: HttpRequestTypes;
};

const REQUEST_TIMEOUT_MS = 10_000;

let cachedHttpClient: KyInstance | undefined;

const getSameOriginRequestUrl = (path: string) => {
  if (typeof window === 'undefined') {
    throw createApiConfigurationError('httpClient is available only in the browser.');
  }

  const requestUrl = new URL(path, window.location.origin);

  if (requestUrl.origin !== window.location.origin) {
    throw createApiConfigurationError('httpClient accepts only same-origin API routes.');
  }

  return requestUrl.toString();
};

export const createHttpClient = () => {
  return ky.create({
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

export const getHttpClient = () => {
  cachedHttpClient ??= createHttpClient();

  return cachedHttpClient;
};

const request = async <ResponseDataTypes>(path: string, options?: Options) => {
  try {
    return await getHttpClient()<ResponseDataTypes>(getSameOriginRequestUrl(path), options).json();
  } catch (error) {
    throw await normalizeApiError(error);
  }
};

const withMethod = (method: HttpMethodTypes) => {
  return <ResponseDataTypes>(path: string, options?: Options) => {
    return request<ResponseDataTypes>(path, { ...options, method });
  };
};

export const httpClient: HttpClientTypes = {
  delete: withMethod('delete'),
  get: withMethod('get'),
  patch: withMethod('patch'),
  post: withMethod('post'),
  put: withMethod('put'),
  request,
};
