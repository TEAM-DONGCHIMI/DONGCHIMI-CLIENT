import { useCallback, useEffect, useRef, useState } from 'react';

import { revokeImagePreviewUrl } from '@/shared/utils/image-upload.utils';

interface RegistrationResultImagePreview {
  alt: string;
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

  const replaceImagePreviews = useCallback(
    (nextImagePreviews: ReadonlyMap<string, RegistrationResultImagePreview>) => {
      imagePreviewsRef.current = nextImagePreviews;
      setImagePreviews(nextImagePreviews);
    },
    [],
  );

  const setImagePreview = useCallback(
    (productId: string, file: File) => {
      let previewUrl: string;

      try {
        previewUrl = URL.createObjectURL(file);
      } catch (error) {
        onPreviewCreateError?.(error);

        return;
      }

      const previousPreviewUrl = imagePreviewsRef.current.get(productId)?.src ?? null;
      const nextImagePreviews = new Map(imagePreviewsRef.current);

      revokeImagePreviewUrl(previousPreviewUrl);
      nextImagePreviews.set(productId, { alt: file.name, src: previewUrl });
      replaceImagePreviews(nextImagePreviews);
    },
    [onPreviewCreateError, replaceImagePreviews],
  );

  const deleteImagePreviews = useCallback(
    (productIds: Iterable<string>) => {
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
    },
    [replaceImagePreviews],
  );

  return {
    deleteImagePreviews,
    imagePreviews,
    setImagePreview,
  };
};
