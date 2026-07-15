import { API_ENDPOINTS, type CommonApiTypes, validateApiResponse, z } from '@dongchimi/shared/api';

import type { PresignedUploadPurposeTypes } from '@/shared/constants/presigned-upload-purpose';

import { httpClient } from './http-client';

export type PresignedUploadRequestTypes = Omit<CommonApiTypes.PresignedUploadRequest, 'purpose'> & {
  purpose: PresignedUploadPurposeTypes;
};
export type PresignedUploadResponseTypes = CommonApiTypes.PresignedUploadResponse;
type PresignedUploadApiResponseTypes = CommonApiTypes.ApiResponsePresignedUploadResponse;

interface UploadFileToPresignedUrlParams {
  file: File;
  requiredHeaders: Record<string, string>;
  uploadUrl: string;
}

const presignedUploadResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    uploadUrl: z.url(),
    objectKey: z.string().min(1),
    expiresAt: z.iso.datetime({ local: true, offset: true }),
    requiredHeaders: z.record(z.string(), z.string()),
  }),
}) satisfies z.ZodType<PresignedUploadApiResponseTypes>;

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

export const uploadFileToPresignedUrl = async ({
  file,
  requiredHeaders,
  uploadUrl,
}: UploadFileToPresignedUrlParams) => {
  const response = await fetch(uploadUrl, {
    body: file,
    headers: requiredHeaders,
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error(`Presigned upload failed with status ${response.status}.`);
  }
};
