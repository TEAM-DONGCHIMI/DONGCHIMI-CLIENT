import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';
import { HTTPError, type Options } from 'ky';

import { useAuthStore } from '../stores/auth-store';
import { authRefreshResponseSchema } from './auth-refresh-schema';
import { HTTP_STATUS } from './http-status';

interface HttpAuthOptionsTypes {
  skipAuthorization?: boolean;
  skipRefresh?: boolean;
}

export type HttpClientOptionsTypes = Options & {
  auth?: HttpAuthOptionsTypes;
};

type HttpAuthRequestTypes = <ResponseDataTypes>(
  path: string,
  options?: HttpClientOptionsTypes,
  accessToken?: string,
) => Promise<ResponseDataTypes>;

const AUTHORIZATION_HEADER = 'Authorization';
const AUTHORIZATION_TOKEN_PREFIX = 'Bearer';
const AUTH_REFRESH_RESPONSE_SCHEMA_DESCRIPTION = 'ApiResponseAuthRefreshResponse';

let refreshAccessTokenPromise: Promise<string> | undefined;

const createHeaders = (headers: Options['headers']) => {
  const nextHeaders = new Headers();

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      nextHeaders.set(key, value);
    });

    return nextHeaders;
  }

  if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      nextHeaders.set(key, value);
    });

    return nextHeaders;
  }

  Object.entries(headers ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      nextHeaders.set(key, value);
    }
  });

  return nextHeaders;
};

export const createAuthorizedRequestOptions = (
  options: HttpClientOptionsTypes | undefined,
  accessToken = useAuthStore.getState().accessToken,
) => {
  const { auth, ...requestOptions } = options ?? {};

  if (auth?.skipAuthorization || !accessToken) {
    return requestOptions;
  }

  const headers = createHeaders(requestOptions.headers);
  headers.set(AUTHORIZATION_HEADER, `${AUTHORIZATION_TOKEN_PREFIX} ${accessToken}`);

  return {
    ...requestOptions,
    headers,
  };
};

const requestRefreshAccessToken = async (request: HttpAuthRequestTypes) => {
  const endpoint = API_ENDPOINTS.common.auth.refresh;
  const response = await request<unknown>(endpoint, {
    auth: {
      skipAuthorization: true,
      skipRefresh: true,
    },
    credentials: 'include',
    method: 'post',
  });
  const result = validateApiResponse(authRefreshResponseSchema, response, {
    endpoint,
    schemaDescription: AUTH_REFRESH_RESPONSE_SCHEMA_DESCRIPTION,
  });
  const { accessToken } = result.data;

  useAuthStore.getState().setAccessToken(accessToken);

  return accessToken;
};

export const refreshAccessToken = (request: HttpAuthRequestTypes) => {
  refreshAccessTokenPromise ??= requestRefreshAccessToken(request).finally(() => {
    refreshAccessTokenPromise = undefined;
  });

  return refreshAccessTokenPromise;
};

export const shouldRefreshAccessToken = (error: unknown, options?: HttpClientOptionsTypes) => {
  return (
    error instanceof HTTPError &&
    error.response.status === HTTP_STATUS.UNAUTHORIZED &&
    options?.auth?.skipRefresh !== true
  );
};

export const clearAuthSession = () => {
  useAuthStore.getState().clearSession();
};
