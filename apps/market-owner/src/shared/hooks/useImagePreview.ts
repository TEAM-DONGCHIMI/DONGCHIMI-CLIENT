import { type ChangeEventHandler, useEffect, useRef } from 'react';

import { revokeImagePreviewUrl } from '@/shared/utils/image-upload.utils';

interface UseImagePreviewParams {
  currentPreviewUrl: string | null;
  isValidFile: (file: File) => boolean;
  onPreviewChange: (payload: { file: File; previewUrl: string }) => void;
  previewUrls: (string | null)[];
}

export const useImagePreview = ({
  currentPreviewUrl,
  isValidFile,
  onPreviewChange,
  previewUrls,
}: UseImagePreviewParams) => {
  const previewUrlsRef = useRef(previewUrls);

  useEffect(() => {
    previewUrlsRef.current = previewUrls;
  }, [previewUrls]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((previewUrl) => {
        revokeImagePreviewUrl(previewUrl);
      });
    };
  }, []);

  const createPreviewUrl = (file: File, previousPreviewUrl: string | null) => {
    const previewUrl = URL.createObjectURL(file);

    revokeImagePreviewUrl(previousPreviewUrl);

    return previewUrl;
  };

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!isValidFile(file)) {
      event.target.value = '';
      return;
    }

    const previewUrl = createPreviewUrl(file, currentPreviewUrl);

    onPreviewChange({ file, previewUrl });
    event.target.value = '';
  };

  const revokeCurrentPreviewUrl = () => {
    revokeImagePreviewUrl(currentPreviewUrl);
  };

  return {
    imageInputProps: {
      onChange: handleImageChange,
    },
    revokeCurrentPreviewUrl,
  };
};
