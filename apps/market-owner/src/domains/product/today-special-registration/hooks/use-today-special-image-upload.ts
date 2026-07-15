import { type PresignedUploadResponseTypes, uploadFileToPresignedUrl } from '@/shared/api';
import { PRESIGNED_UPLOAD_PURPOSE } from '@/shared/constants/presigned-upload-purpose';

import { usePresignedUploadMutation } from '../../hooks';
import type { TodaySpecialProductFormTypes } from '../model';

type UploadedProductImageObjectKeyTypes = PresignedUploadResponseTypes['objectKey'] | null;

export const useTodaySpecialImageUpload = () => {
  const presignedUploadMutation = usePresignedUploadMutation();

  const uploadProductImage = async (
    product: TodaySpecialProductFormTypes,
  ): Promise<UploadedProductImageObjectKeyTypes> => {
    if (product.imageFile == null) {
      return null;
    }

    const uploadContract = await presignedUploadMutation.mutateAsync({
      contentLength: product.imageFile.size,
      contentType: product.imageFile.type,
      purpose: PRESIGNED_UPLOAD_PURPOSE.PRODUCT_THUMBNAIL,
    });

    await uploadFileToPresignedUrl({
      file: product.imageFile,
      requiredHeaders: uploadContract.requiredHeaders,
      uploadUrl: uploadContract.uploadUrl,
    });

    return uploadContract.objectKey;
  };

  return {
    uploadProductImage,
  };
};
