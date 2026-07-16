import { useState } from 'react';
import { useToast } from '@dongchimi/shared/toast';

import { normalizeApiError } from '@/shared/api';
import type { UpdateProductRequestTypes } from '../api/update-product';
import {
  createProductUpdateRequest,
  type ProductUpdateFormValuesTypes,
} from '../model/create-product-update-request';
import { useProductThumbnailUpload } from './use-product-thumbnail-upload';
import { useProductUpdateMutation } from './use-product-update-mutation';

interface SubmitProductUpdateParams {
  currentThumbnailUrl: string | null;
  dealType: UpdateProductRequestTypes['type'];
  imageFile: File | null;
  marketId: number;
  productId: number;
  values: ProductUpdateFormValuesTypes;
}

type ProductUpdateResultTypes = { success: true; thumbnailUrl: string | null } | { success: false };

const productUpdateErrorMessages = {
  failed: '상품 정보를 수정하지 못했습니다. 다시 시도해주세요.',
  network: '인터넷 연결을 확인한 후 다시 시도해주세요.',
} as const;

const getProductUpdateErrorMessage = (error: unknown) => {
  const normalizedError = normalizeApiError(error);

  if (normalizedError.type === 'network') {
    return productUpdateErrorMessages.network;
  }

  if (['auth', 'client', 'server', 'validation'].includes(normalizedError.type)) {
    return normalizedError.message || productUpdateErrorMessages.failed;
  }

  return productUpdateErrorMessages.failed;
};

export const useProductUpdateFlow = () => {
  const [isPending, setIsPending] = useState(false);
  const toast = useToast();
  const { uploadProductThumbnail } = useProductThumbnailUpload();
  const productUpdateMutation = useProductUpdateMutation();

  const submitProductUpdate = async ({
    currentThumbnailUrl,
    dealType,
    imageFile,
    marketId,
    productId,
    values,
  }: SubmitProductUpdateParams): Promise<ProductUpdateResultTypes> => {
    if (isPending) {
      return { success: false };
    }

    setIsPending(true);

    try {
      const uploadedThumbnail = imageFile ? await uploadProductThumbnail(imageFile) : null;
      const requestThumbnail = uploadedThumbnail?.objectKey ?? currentThumbnailUrl;
      const thumbnailUrl = uploadedThumbnail?.publicUrl ?? currentThumbnailUrl;

      await productUpdateMutation.mutateAsync({
        marketId,
        productId,
        request: createProductUpdateRequest({
          dealType,
          thumbnailUrl: requestThumbnail,
          values,
        }),
      });

      return { success: true, thumbnailUrl };
    } catch (error) {
      toast.error(getProductUpdateErrorMessage(error));

      return { success: false };
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    submitProductUpdate,
  };
};
