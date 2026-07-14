import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import {
  authRefreshResponseSchema,
  type AuthRefreshResponseTypes,
} from '@/shared/api/auth-refresh-schema';
import { httpClient, type OwnerApiTypes } from '@/shared/api';

import {
  ownerLoginResponseSchema,
  ownerSignupResponseSchema,
  type OwnerLoginResponseTypes,
  type OwnerSignupResponseTypes,
} from '../model/auth-schema';

export type OwnerLoginRequestTypes = OwnerApiTypes.OwnerLoginRequest;
export type OwnerSignupRequestTypes = OwnerApiTypes.OwnerSignupRequest;

export const loginMarketOwner = async (
  body: OwnerLoginRequestTypes,
): Promise<OwnerLoginResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.auth.login;
  const response = await httpClient.post<unknown>(endpoint, {
    auth: {
      skipAuthorization: true,
      skipRefresh: true,
    },
    credentials: 'include',
    json: body,
  });

  return validateApiResponse(ownerLoginResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseOwnerLoginResponse',
  });
};

export const signupMarketOwner = async (
  body: OwnerSignupRequestTypes,
): Promise<OwnerSignupResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.auth.signup;
  const response = await httpClient.post<unknown>(endpoint, {
    auth: {
      skipAuthorization: true,
      skipRefresh: true,
    },
    json: body,
  });

  return validateApiResponse(ownerSignupResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseOwnerSignupResponse',
  });
};

export const refreshMarketOwnerAuth = async (): Promise<AuthRefreshResponseTypes> => {
  const endpoint = API_ENDPOINTS.common.auth.refresh;
  const response = await httpClient.post<unknown>(endpoint, {
    auth: {
      skipAuthorization: true,
      skipRefresh: true,
    },
    credentials: 'include',
  });

  return validateApiResponse(authRefreshResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseAuthRefreshResponse',
  });
};
