import { useMutation } from '@tanstack/react-query';

import { createPresignedUploadUrl, uploadFileToPresignedUrl } from '@/shared/api';
import { PRESIGNED_UPLOAD_PURPOSE } from '@/shared/constants/presigned-upload-purpose';

const uploadMarketThumbnail = async (file: File) => {
  const uploadContract = await createPresignedUploadUrl({
    contentLength: file.size,
    contentType: file.type,
    purpose: PRESIGNED_UPLOAD_PURPOSE.MARKET_THUMBNAIL,
  });

  await uploadFileToPresignedUrl({
    file,
    requiredHeaders: uploadContract.requiredHeaders,
    uploadUrl: uploadContract.uploadUrl,
  });

  return uploadContract.objectKey;
};

export const useMarketThumbnailUploadMutation = () => {
  return useMutation({
    mutationFn: uploadMarketThumbnail,
  });
};
