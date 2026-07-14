import ky, { type KyInstance, type Options } from 'ky';

import { getMarketOwnerEnv } from '../config';
import { createApiConfigurationError, normalizeApiError } from './api-error';
import { HTTP_STATUS } from './http-status';

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
  const { apiBaseUrl } = getMarketOwnerEnv();

  if (!apiBaseUrl) {
    throw createApiConfigurationError('VITE_PUBLIC_API_SERVER_BASE_URL is not configured.');
  }

  return apiBaseUrl;
};

export const createHttpClient = () => {
  return ky.create({
    prefix: getApiBaseUrl(),
    retry: {
      limit: 0,
    },
    timeout: REQUEST_TIMEOUT_MS,
    hooks: {
      beforeRequest: [
        ({ request }) => {
          request.headers.set('Accept', 'application/json');

          const { devAccessToken } = getMarketOwnerEnv();

          // TODO: 로그인 세션 연동 후 개발용 토큰 주입을 제거합니다.
          if (devAccessToken) {
            request.headers.set('Authorization', `Bearer ${devAccessToken}`);
          }
        },
      ],
    },
  });
};

export const getHttpClient = () => {
  cachedHttpClient ??= createHttpClient();

  return cachedHttpClient;
};

const parseJsonResponse = async <ResponseDataTypes>(response: Response) => {
  if (response.status === HTTP_STATUS.NO_CONTENT) {
    return undefined as ResponseDataTypes;
  }

  const text = await response.text();

  if (!text) {
    return undefined as ResponseDataTypes;
  }

  return JSON.parse(text) as ResponseDataTypes;
};

const request = async <ResponseDataTypes>(path: string, options?: Options) => {
  try {
    const response = await getHttpClient()(path, options);

    return await parseJsonResponse<ResponseDataTypes>(response);
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
