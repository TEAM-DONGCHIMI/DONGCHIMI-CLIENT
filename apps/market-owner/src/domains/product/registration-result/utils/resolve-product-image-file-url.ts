import {
  createApiConfigurationError,
  type PresignedUploadRequestTypes,
  type PresignedUploadResponseTypes,
  uploadFileToPresignedUrl,
} from '@/shared/api';
import { getMarketOwnerEnv } from '@/shared/config';
import { PRESIGNED_UPLOAD_PURPOSE } from '@/shared/constants/presigned-upload-purpose';

const DEFAULT_IMAGE_CONTENT_TYPE = 'application/octet-stream';

type RequestPresignedUploadUrlTypes = (
  request: PresignedUploadRequestTypes,
) => Promise<PresignedUploadResponseTypes>;

export type ResolveProductImageFileUrlTypes = (file: File) => Promise<string>;

const getRequiredPublicS3BaseUrl = () => {
  const { s3BaseUrl } = getMarketOwnerEnv();

  if (!s3BaseUrl) {
    throw createApiConfigurationError('VITE_PUBLIC_S3_BASE_URL is not configured.');
  }

  return s3BaseUrl;
};

const createPublicS3FileUrl = (objectKey: string, s3BaseUrl: string) => {
  return `${s3BaseUrl}/${objectKey.replace(/^\/+/, '')}`;
};

export const resolvePresignedProductImageFileUrl =
  (requestPresignedUploadUrl: RequestPresignedUploadUrlTypes): ResolveProductImageFileUrlTypes =>
  async (file) => {
    const s3BaseUrl = getRequiredPublicS3BaseUrl();
    const presignedUpload = await requestPresignedUploadUrl({
      contentLength: file.size,
      contentType: file.type || DEFAULT_IMAGE_CONTENT_TYPE,
      purpose: PRESIGNED_UPLOAD_PURPOSE.PRODUCT_THUMBNAIL,
    });

    await uploadFileToPresignedUrl({
      file,
      requiredHeaders: presignedUpload.requiredHeaders,
      uploadUrl: presignedUpload.uploadUrl,
    });

    return createPublicS3FileUrl(presignedUpload.objectKey, s3BaseUrl);
  };
