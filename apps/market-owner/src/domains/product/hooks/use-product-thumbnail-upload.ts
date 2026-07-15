import { createApiConfigurationError, uploadFileToPresignedUrl } from '@/shared/api';
import { getMarketOwnerEnv } from '@/shared/config';
import { PRESIGNED_UPLOAD_PURPOSE } from '@/shared/constants/presigned-upload-purpose';

import { usePresignedUploadMutation } from './use-presigned-upload-mutation';

const createPublicProductThumbnailUrl = (s3BaseUrl: string, objectKey: string) => {
  return `${s3BaseUrl}/${objectKey.replace(/^\/+/, '')}`;
};

export const useProductThumbnailUpload = () => {
  const presignedUploadMutation = usePresignedUploadMutation();

  const uploadProductThumbnail = async (imageFile: File) => {
    const { s3BaseUrl } = getMarketOwnerEnv();

    if (!s3BaseUrl) {
      throw createApiConfigurationError('VITE_PUBLIC_S3_BASE_URL is not configured.');
    }

    const uploadContract = await presignedUploadMutation.mutateAsync({
      contentLength: imageFile.size,
      contentType: imageFile.type,
      purpose: PRESIGNED_UPLOAD_PURPOSE.PRODUCT_THUMBNAIL,
    });

    await uploadFileToPresignedUrl({
      file: imageFile,
      requiredHeaders: uploadContract.requiredHeaders,
      uploadUrl: uploadContract.uploadUrl,
    });

    return createPublicProductThumbnailUrl(s3BaseUrl, uploadContract.objectKey);
  };

  return { uploadProductThumbnail };
};
