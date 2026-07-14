import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

import { ownerSignupResponseSchema, type OwnerSignupResponseTypes } from '../model/auth-schema';

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
    schemaDescription: 'ApiResponseOwnerSignupResponse',
  });
};
