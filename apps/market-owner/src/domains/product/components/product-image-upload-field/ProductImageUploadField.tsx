import { type ChangeEventHandler, type ReactNode } from 'react';

import { IcCamera, IcPlus } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './ProductImageUploadField.css';

type ProductImageUploadFieldVariantTypes = 'registration' | 'editModal';

interface ProductImageUploadFieldProps {
  label: string;
  accept?: string;
  className?: string;
  description?: ReactNode;
  id?: string;
  previewAlt?: string;
  previewUrl?: string | null;
  variant?: ProductImageUploadFieldVariantTypes;
  onImageChange?: ChangeEventHandler<HTMLInputElement>;
}

const EMPTY_IMAGE_COPY = (
  <>
    상품 이미지를
    <br />
    추가하세요
  </>
);

export const ProductImageUploadField = ({
  accept,
  className,
  description,
  id,
  label,
  onImageChange,
  previewAlt = '상품 이미지 미리보기',
  previewUrl,
  variant = 'registration',
}: ProductImageUploadFieldProps) => {
  const hasFileInput = id != null && onImageChange != null;
  const imageBoxClassName = cn(
    S.imageBoxRecipe({ variant }),
    hasFileInput && S.uploadTriggerClassName,
    previewUrl && S.imageBoxPreviewRecipe({ variant }),
  );
  const fileInput = hasFileInput && (
    <input
      accept={accept}
      className={S.fileInputClassName}
      id={id}
      onChange={onImageChange}
      type='file'
    />
  );
  const cameraIcon = (
    <span className={S.cameraBadgeRecipe({ variant })} aria-hidden='true'>
      <IcCamera />
    </span>
  );
  const imageBoxContent = (
    <>
      {previewUrl && (
        <span className={S.previewContentClassName}>
          <img alt={previewAlt} className={S.previewImageClassName} src={previewUrl} />
          {cameraIcon}
        </span>
      )}
      {!previewUrl && variant === 'registration' && (
        <span className={S.emptyContentClassName}>
          <IcPlus className={S.emptyIconClassName} aria-hidden='true' />
          <span>{EMPTY_IMAGE_COPY}</span>
        </span>
      )}
      {!previewUrl && variant === 'editModal' && cameraIcon}
    </>
  );
  const imageUploadFrame = (
    <>
      {hasFileInput && (
        <label className={imageBoxClassName} htmlFor={id}>
          {imageBoxContent}
        </label>
      )}
      {!hasFileInput && <div className={imageBoxClassName}>{imageBoxContent}</div>}
    </>
  );

  return (
    <div className={cn(S.rootRecipe({ variant }), className)}>
      <div className={S.textGroupClassName}>
        {hasFileInput && (
          <label className={S.labelRecipe({ variant })} htmlFor={id}>
            {label}
          </label>
        )}
        {!hasFileInput && <span className={S.labelRecipe({ variant })}>{label}</span>}
        {description && <p className={S.descriptionClassName}>{description}</p>}
      </div>

      {imageUploadFrame}
      {fileInput}
    </div>
  );
};
