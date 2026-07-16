import {
  type PresignedUploadRequestTypes,
  type PresignedUploadResponseTypes,
  uploadFileToPresignedUrl,
} from '@/shared/api';
import { PRESIGNED_UPLOAD_PURPOSE } from '@/shared/constants/presigned-upload-purpose';

const DEFAULT_IMAGE_CONTENT_TYPE = 'application/octet-stream';

type RequestPresignedUploadUrlTypes = (
  request: PresignedUploadRequestTypes,
) => Promise<PresignedUploadResponseTypes>;

export type ResolveProductImageFileObjectKeyTypes = (file: File) => Promise<string>;

export const resolvePresignedProductImageFileObjectKey =
  (
    requestPresignedUploadUrl: RequestPresignedUploadUrlTypes,
  ): ResolveProductImageFileObjectKeyTypes =>
  async (file) => {
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

    return presignedUpload.objectKey;
  };
