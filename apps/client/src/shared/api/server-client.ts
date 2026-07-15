import ky from 'ky';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAMES } from '@/shared/auth';
import { getServerEnv } from '@/shared/config/server-env';
import { createApiConfigurationError } from './api-error';

interface CreateServerApiOptions {
  includeAccessToken?: boolean;
}

const REQUEST_TIMEOUT_MS = 10_000;

export const createServerApi = async ({
  includeAccessToken = true,
}: CreateServerApiOptions = {}) => {
  const { apiBaseUrl } = getServerEnv();

  if (!apiBaseUrl) {
    throw createApiConfigurationError('API_BASE_URL is not configured.');
  }

  const accessToken = includeAccessToken
    ? (await cookies()).get(AUTH_COOKIE_NAMES.accessToken)?.value
    : undefined;

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

          if (accessToken) {
            request.headers.set('Authorization', `Bearer ${accessToken}`);
          }
        },
      ],
    },
  });
};
