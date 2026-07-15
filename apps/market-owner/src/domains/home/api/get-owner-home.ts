import { API_ENDPOINTS, validateApiResponse } from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import { ownerHomeResponseSchema, type OwnerHomeResponseTypes } from '../model/owner-home-schema';

export const getOwnerHome = async (): Promise<OwnerHomeResponseTypes> => {
  const response = await httpClient.get<unknown>(API_ENDPOINTS.owner.home);
  const validatedResponse = validateApiResponse(ownerHomeResponseSchema, response, {
    endpoint: API_ENDPOINTS.owner.home,
    schemaDescription: 'Owner home response',
  });

  return validatedResponse.data;
};
