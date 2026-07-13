import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

import {
  ownerLoginResponseSchema,
  ownerSignupResponseSchema,
  type OwnerLoginResponseTypes,
  type OwnerSignupResponseTypes,
} from '../model/auth-schema';

const OWNER_LOGIN_RESPONSE_SCHEMA_DESCRIPTION = 'ApiResponseOwnerLoginResponse';
const OWNER_SIGNUP_RESPONSE_SCHEMA_DESCRIPTION = 'ApiResponseOwnerSignupResponse';

export type OwnerLoginRequestTypes = OwnerApiTypes.OwnerLoginRequest;
export type OwnerSignupRequestTypes = OwnerApiTypes.OwnerSignupRequest;

export const loginMarketOwner = async (
  body: OwnerLoginRequestTypes,
): Promise<OwnerLoginResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.auth.login;
  const response = await httpClient.post<unknown>(endpoint, {
    credentials: 'include',
    json: body,
  });

  return validateApiResponse(ownerLoginResponseSchema, response, {
    endpoint,
    schemaDescription: OWNER_LOGIN_RESPONSE_SCHEMA_DESCRIPTION,
  });
};

export const signupMarketOwner = async (
  body: OwnerSignupRequestTypes,
): Promise<OwnerSignupResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.auth.signup;
  const response = await httpClient.post<unknown>(endpoint, {
    json: body,
  });

  return validateApiResponse(ownerSignupResponseSchema, response, {
    endpoint,
    schemaDescription: OWNER_SIGNUP_RESPONSE_SCHEMA_DESCRIPTION,
  });
};
