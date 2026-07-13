import { uploadFileToPresignedUrl } from '@/shared/api';

import { usePresignedUploadMutation } from '../../hooks';
import type { TodaySpecialProductFormTypes } from '../model';

export const useTodaySpecialImageUpload = () => {
  const presignedUploadMutation = usePresignedUploadMutation();

  const uploadProductImages = async (products: TodaySpecialProductFormTypes[]) => {
    const objectKeys: (string | null)[] = [];

    for (const product of products) {
      if (product.imageFile == null) {
        objectKeys.push(null);
        continue;
      }

      const uploadContract = await presignedUploadMutation.mutateAsync({
        contentLength: product.imageFile.size,
        contentType: product.imageFile.type,
        purpose: 'PRODUCT_THUMBNAIL',
      });

      await uploadFileToPresignedUrl({
        file: product.imageFile,
        requiredHeaders: uploadContract.requiredHeaders,
        uploadUrl: uploadContract.uploadUrl,
      });
      objectKeys.push(uploadContract.objectKey);
    }

    return objectKeys;
  };

  return {
    uploadProductImages,
  };
};
