import { API_ENDPOINTS, type CommonApiTypes, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient } from './http-client';

export type PresignedUploadRequestTypes = CommonApiTypes.PresignedUploadRequest;
export type PresignedUploadResponseTypes = CommonApiTypes.PresignedUploadResponse;

const presignedUploadResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    uploadUrl: z.url(),
    objectKey: z.string().min(1),
    expiresAt: z.iso.datetime(),
    requiredHeaders: z.record(z.string(), z.string()),
  }),
});

export const createPresignedUploadUrl = async (
  request: PresignedUploadRequestTypes,
): Promise<PresignedUploadResponseTypes> => {
  const response = await httpClient.post<unknown>(API_ENDPOINTS.common.uploads.presignedUrl, {
    json: request,
  });
  const validatedResponse = validateApiResponse(presignedUploadResponseSchema, response, {
    endpoint: API_ENDPOINTS.common.uploads.presignedUrl,
    schemaDescription: 'Presigned upload URL response',
  });

  return validatedResponse.data;
};
