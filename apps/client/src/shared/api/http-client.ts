import ky, { type KyInstance, type Options } from 'ky';

import { getClientEnv } from '@/shared/config';
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

const getApiBaseUrl = () => {
  const { apiBaseUrl } = getClientEnv();

  if (!apiBaseUrl) {
    throw createApiConfigurationError('NEXT_PUBLIC_API_BASE_URL is not configured.');
  }

  return apiBaseUrl;
};

const isExternalRequestPath = (path: string) => {
  if (path.startsWith('//')) {
    return true;
  }

  try {
    new URL(path);

    return true;
  } catch {
    return false;
  }
};

export const createHttpClient = () => {
  const apiBaseUrl = getApiBaseUrl();

  return ky.create({
    prefix: apiBaseUrl,
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
    if (isExternalRequestPath(path)) {
      throw createApiConfigurationError(
        'httpClient accepts only relative paths for the configured API origin.',
      );
    }

    return await getHttpClient()<ResponseDataTypes>(path, options).json();
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
