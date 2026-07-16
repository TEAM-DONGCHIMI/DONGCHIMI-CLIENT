import { useEffect, useRef, useState } from 'react';

import { revokeImagePreviewUrl } from '@/shared/utils/image-upload.utils';

export interface RegistrationResultImagePreview {
  alt: string;
  file: File;
  src: string;
}

interface UseRegistrationResultImagePreviewsParams {
  onPreviewCreateError?: (error: unknown) => void;
}

export const useRegistrationResultImagePreviews = ({
  onPreviewCreateError,
}: UseRegistrationResultImagePreviewsParams = {}) => {
  const imagePreviewsRef = useRef<ReadonlyMap<string, RegistrationResultImagePreview>>(new Map());
  const [imagePreviews, setImagePreviews] = useState<
    ReadonlyMap<string, RegistrationResultImagePreview>
  >(() => new Map());

  useEffect(() => {
    return () => {
      imagePreviewsRef.current.forEach((imagePreview) => {
        revokeImagePreviewUrl(imagePreview.src);
      });
    };
  }, []);

  const replaceImagePreviews = (
    nextImagePreviews: ReadonlyMap<string, RegistrationResultImagePreview>,
  ) => {
    imagePreviewsRef.current = nextImagePreviews;
    setImagePreviews(nextImagePreviews);
  };

  const setImagePreview = (productId: string, file: File) => {
    let previewUrl: string;

    try {
      previewUrl = URL.createObjectURL(file);
    } catch (error) {
      onPreviewCreateError?.(error);

      return false;
    }

    const previousPreviewUrl = imagePreviewsRef.current.get(productId)?.src ?? null;
    const nextImagePreviews = new Map(imagePreviewsRef.current);

    revokeImagePreviewUrl(previousPreviewUrl);
    nextImagePreviews.set(productId, { alt: file.name, file, src: previewUrl });
    replaceImagePreviews(nextImagePreviews);

    return true;
  };

  const deleteImagePreviews = (productIds: Iterable<string>) => {
    const nextImagePreviews = new Map(imagePreviewsRef.current);

    Array.from(productIds).forEach((productId) => {
      const imagePreview = nextImagePreviews.get(productId);

      if (imagePreview == null) {
        return;
      }

      revokeImagePreviewUrl(imagePreview.src);
      nextImagePreviews.delete(productId);
    });

    replaceImagePreviews(nextImagePreviews);
  };

  return {
    deleteImagePreviews,
    imagePreviews,
    setImagePreview,
  };
};
