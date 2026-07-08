import { type ChangeEvent, useEffect, useId, useState } from 'react';

import { Stack } from '@dongchimi/design-system/components';
import { IcCamera, IcPlus } from '@dongchimi/design-system/icons';

import * as S from './MarketImageUploadSection.css';

export interface MarketImageUploadSectionProps {
  onImageSelect: (file: File) => void;
}

export const MarketImageUploadSection = ({ onImageSelect }: MarketImageUploadSectionProps) => {
  const imageInputId = useId();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];

    if (selectedFile) {
      const nextPreviewImageUrl = URL.createObjectURL(selectedFile);

      onImageSelect(selectedFile);
      setPreviewImageUrl(nextPreviewImageUrl);
      event.currentTarget.value = '';
    }
  };

  return (
    <Stack aria-label='마트 이미지' as='section' className={S.imageColumnClassName}>
      <input
        accept='image/*'
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
