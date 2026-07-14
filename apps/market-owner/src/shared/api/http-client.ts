import ky, { type KyInstance } from 'ky';

import { getMarketOwnerEnv } from '../config';
import { createApiConfigurationError, normalizeApiError } from './api-error';
import {
  clearAuthSession,
  createAuthorizedRequestOptions,
  refreshAccessToken,
  shouldRefreshAccessToken,
  type HttpClientOptionsTypes,
} from './http-auth';
import { HTTP_STATUS } from './http-status';

type HttpMethodTypes = 'delete' | 'get' | 'patch' | 'post' | 'put';

type HttpRequestTypes = <ResponseDataTypes>(
  path: string,
  options?: HttpClientOptionsTypes,
) => Promise<ResponseDataTypes>;

type HttpStreamRequestTypes = (path: string, options?: HttpClientOptionsTypes) => Promise<Response>;

type HttpClientTypes = Record<HttpMethodTypes, HttpRequestTypes> & {
  request: HttpRequestTypes;
  stream: HttpStreamRequestTypes;
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
          if (!request.headers.has('Accept')) {
            request.headers.set('Accept', 'application/json');
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

const performResponse = (path: string, options?: HttpClientOptionsTypes, accessToken?: string) => {
  return getHttpClient()(path, createAuthorizedRequestOptions(options, accessToken));
};

const performRequest = async <ResponseDataTypes>(
  path: string,
  options?: HttpClientOptionsTypes,
  accessToken?: string,
) => {
  const response = await performResponse(path, options, accessToken);

  return await parseJsonResponse<ResponseDataTypes>(response);
};

export const refreshAuthSession = () => {
  return refreshAccessToken(performRequest);
};

const requestWithAuthRefresh = async <ResponseDataTypes>(
  perform: (accessToken?: string) => Promise<ResponseDataTypes>,
  options?: HttpClientOptionsTypes,
) => {
  try {
    return await perform();
  } catch (error) {
    if (!shouldRefreshAccessToken(error, options)) {
      throw await normalizeApiError(error);
    }

    let accessToken: string;

    try {
      accessToken = await refreshAuthSession();
    } catch (refreshError) {
      clearAuthSession();

      throw await normalizeApiError(refreshError);
    }

    try {
      return await perform(accessToken);
    } catch (retryError) {
      throw await normalizeApiError(retryError);
    }
  }
};

const request = <ResponseDataTypes>(path: string, options?: HttpClientOptionsTypes) => {
  const retryOptions = {
    ...options,
    auth: {
      ...options?.auth,
      skipRefresh: true,
    },
  } satisfies HttpClientOptionsTypes;

  return requestWithAuthRefresh(
    (accessToken) =>
      performRequest<ResponseDataTypes>(path, accessToken ? retryOptions : options, accessToken),
    options,
  );
};

const stream = (path: string, options?: HttpClientOptionsTypes) => {
  const retryOptions = {
    ...options,
    auth: {
      ...options?.auth,
      skipRefresh: true,
    },
  } satisfies HttpClientOptionsTypes;

  return requestWithAuthRefresh(
    (accessToken) => performResponse(path, accessToken ? retryOptions : options, accessToken),
    options,
  );
};

const withMethod = (method: HttpMethodTypes) => {
  return <ResponseDataTypes>(path: string, options?: HttpClientOptionsTypes) => {
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
  stream,
};

export type { HttpClientOptionsTypes } from './http-auth';
