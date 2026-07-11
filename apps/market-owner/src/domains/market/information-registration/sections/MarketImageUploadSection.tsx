import { type ChangeEvent, useEffect, useId, useState } from 'react';

import { Stack } from '@dongchimi/design-system/components';
import { IcCamera, IcPlus } from '@dongchimi/design-system/icons';

import * as S from './MarketImageUploadSection.css';

export interface MarketImageUploadSectionProps {
  onImageError: (error: MarketImageUploadErrorTypes) => void;
  onImageSelect: (file: File) => Promise<void> | void;
}

export type MarketImageUploadErrorTypes = 'network' | 'size' | 'type' | 'upload';

const allowedImageTypes = new Set(['image/jpeg', 'image/png']);
const maxImageFileSizeBytes = 10 * 1024 * 1024;

export const MarketImageUploadSection = ({
  onImageError,
  onImageSelect,
}: MarketImageUploadSectionProps) => {
  const imageInputId = useId();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];

    event.currentTarget.value = '';

    if (!selectedFile) {
      return;
    }

    if (!allowedImageTypes.has(selectedFile.type)) {
      onImageError('type');

      return;
    }

    if (selectedFile.size > maxImageFileSizeBytes) {
      onImageError('size');

      return;
    }

    try {
      await onImageSelect(selectedFile);

      const nextPreviewImageUrl = URL.createObjectURL(selectedFile);
      setPreviewImageUrl(nextPreviewImageUrl);
    } catch {
      onImageError(navigator.onLine ? 'upload' : 'network');
    }
  };

  return (
    <Stack aria-label='마트 이미지' as='section' className={S.imageColumnClassName}>
      <input
        accept='.jpg,.jpeg,.png,image/jpeg,image/png'
        className={S.imageUploadInputClassName}
        id={imageInputId}
        type='file'
        onChange={handleImageChange}
      />
      <label
        aria-label='마트 이미지 추가'
        className={S.imageUploadButtonClassName}
        htmlFor={imageInputId}
      >
        {previewImageUrl ? (
          <>
            <img
              alt='선택한 마트 이미지'
              className={S.imagePreviewClassName}
              src={previewImageUrl}
            />
            <span aria-hidden='true' className={S.imageUploadCameraIconSlotClassName}>
              <IcCamera className={S.imageUploadCameraIconClassName} />
            </span>
          </>
        ) : (
          <>
            <IcPlus aria-hidden='true' className={S.imageUploadIconClassName} />
            <span className={S.imageUploadTextGroupClassName}>
              <span className={S.imageUploadTitleClassName}>마트 이미지를 추가해주세요.</span>
              <span className={S.imageUploadDescriptionClassName}>
                이미지를 등록하지 않으면
                <br />
                기본 이미지가 사용됩니다.
              </span>
            </span>
          </>
        )}
      </label>
      <p className={S.imageGuideClassName}>권장 비율 4:3 · 1200 × 900px 이상</p>
    </Stack>
  );
};
