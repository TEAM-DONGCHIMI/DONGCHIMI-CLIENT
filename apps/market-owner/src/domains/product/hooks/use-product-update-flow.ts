import { useState } from 'react';

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

export const useProductUpdateFlow = () => {
  const [isPending, setIsPending] = useState(false);
  const { uploadProductThumbnail } = useProductThumbnailUpload();
  const productUpdateMutation = useProductUpdateMutation();

  const submitProductUpdate = async ({
    currentThumbnailUrl,
    dealType,
    imageFile,
    marketId,
    productId,
    values,
  }: SubmitProductUpdateParams) => {
    if (isPending) {
      return false;
    }

    setIsPending(true);

    try {
      const thumbnailUrl = imageFile
        ? await uploadProductThumbnail(imageFile)
        : currentThumbnailUrl;

      await productUpdateMutation.mutateAsync({
        marketId,
        productId,
        request: createProductUpdateRequest({ dealType, thumbnailUrl, values }),
      });

      return true;
    } catch {
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    submitProductUpdate,
  };
};
