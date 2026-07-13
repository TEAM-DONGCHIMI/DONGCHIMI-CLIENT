import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

import { ownerSignupResponseSchema, type OwnerSignupResponseTypes } from '../model/auth-schema';

const OWNER_SIGNUP_RESPONSE_SCHEMA_DESCRIPTION = 'ApiResponseOwnerSignupResponse';

export type OwnerSignupRequestTypes = OwnerApiTypes.OwnerSignupRequest;

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
