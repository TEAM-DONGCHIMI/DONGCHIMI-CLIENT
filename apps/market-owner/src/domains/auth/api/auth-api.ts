import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

import { ownerLoginResponseSchema, type OwnerLoginResponseTypes } from '../model/auth-schema';

const OWNER_LOGIN_RESPONSE_SCHEMA_DESCRIPTION = 'ApiResponseOwnerLoginResponse';

export type OwnerLoginRequestTypes = OwnerApiTypes.OwnerLoginRequest;

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
