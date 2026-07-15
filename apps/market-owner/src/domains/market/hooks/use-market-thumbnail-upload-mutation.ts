import { useMutation } from '@tanstack/react-query';

import { createPresignedUploadUrl, uploadFileToPresignedUrl } from '@/shared/api';

const MARKET_THUMBNAIL_UPLOAD_PURPOSE = 'MARKET_THUMBNAIL';

const uploadMarketThumbnail = async (file: File) => {
  const uploadContract = await createPresignedUploadUrl({
    contentLength: file.size,
    contentType: file.type,
    purpose: MARKET_THUMBNAIL_UPLOAD_PURPOSE,
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
