import type { ChangeEventHandler, FocusEventHandler, MouseEventHandler, RefObject } from 'react';

import { cn } from '@dongchimi/design-system/styles';
import {
  IcCamera,
  IcChevronDown,
  IcChevronUp,
  IcCircleExclamationSizeSmallColorNegative,
  IcPlus,
} from '@dongchimi/design-system/icons';

import { FieldGroup } from '../components/FieldGroup';
import {
  todaySpecialImageInputAccept,
  type TodaySpecialProductErrorMessageTypes,
  type TodaySpecialProductFormTypes,
} from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductInfoSectionProps {
  categoryDropdownId: string;
  categoryTriggerRef: RefObject<HTMLButtonElement | null>;
  isCategoryDropdownOpen: boolean;
  onCategoryTriggerClick: MouseEventHandler<HTMLButtonElement>;
  onDescriptionBlur: FocusEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLInputElement>;
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  onNameBlur: FocusEventHandler<HTMLInputElement>;
  onNameChange: ChangeEventHandler<HTMLInputElement>;
  product: TodaySpecialProductFormTypes;
  productErrorMessages: TodaySpecialProductErrorMessageTypes;
}

export const ProductInfoSection = ({
  categoryDropdownId,
  categoryTriggerRef,
  isCategoryDropdownOpen,
  onCategoryTriggerClick,
  onDescriptionBlur,
  onDescriptionChange,
  onImageChange,
  onNameBlur,
  onNameChange,
  product,
  productErrorMessages,
}: ProductInfoSectionProps) => {
  const categoryErrorId = 'today-special-product-category-error';

  return (
    <section className={S.fieldSectionClassName} aria-labelledby='product-info-title'>
      <h2 className={S.sectionTitleClassName} id='product-info-title'>
        상품 정보
      </h2>

      <div className={S.sectionBodyClassName}>
        <div className={S.imageFieldClassName}>
          <div className={S.imageTextGroupClassName}>
            <label className={S.fieldLabelClassName} htmlFor='today-special-product-image'>
              상품 이미지
            </label>
            <p className={S.imageDescriptionClassName}>
              권장 비율 4:3 1200 x 900px 이상을 권장해요.
              <br />
              이미지를 등록하지 않으면 기본 이미지가 사용돼요.
            </p>
          </div>

          <label
            className={cn(
              S.imageUploadBoxClassName,
              product.imagePreviewUrl && S.imageUploadBoxPreviewClassName,
            )}
            htmlFor='today-special-product-image'
          >
            {product.imagePreviewUrl ? (
              <span className={S.imagePreviewContentClassName}>
                <img
                  alt='등록할 상품 이미지 미리보기'
                  className={S.imagePreviewClassName}
                  src={product.imagePreviewUrl}
                />
                <span className={S.cameraBadgeClassName} aria-hidden='true'>
                  <IcCamera />
                </span>
              </span>
            ) : (
              <span className={S.emptyUploadContentClassName}>
                <IcPlus className={S.emptyUploadIconClassName} aria-hidden='true' />
                <span>
                  상품 이미지를
                  <br />
                  추가하세요
                </span>
              </span>
            )}
          </label>
          <input
            accept={todaySpecialImageInputAccept}
            className={S.fileInputClassName}
            id='today-special-product-image'
            onChange={onImageChange}
            type='file'
          />
        </div>

        <div className={S.twoColumnRowClassName}>
          <FieldGroup
            errorMessage={productErrorMessages.name}
            id='today-special-product-name'
            label='상품명'
            onBlur={onNameBlur}
            onChange={onNameChange}
            placeholder='상품명을 입력하세요.'
            status={productErrorMessages.name ? 'error' : 'default'}
            value={product.name}
          />

          <FieldGroup label='상품 구분'>
            <div className={S.categoryWrapperClassName}>
              <button
                aria-describedby={productErrorMessages.category ? categoryErrorId : undefined}
                aria-controls={isCategoryDropdownOpen ? categoryDropdownId : undefined}
                aria-expanded={isCategoryDropdownOpen}
                className={cn(
                  S.categoryTriggerClassName,
                  productErrorMessages.category && S.categoryTriggerErrorClassName,
                )}
                data-today-special-category-trigger
                onClick={onCategoryTriggerClick}
                ref={categoryTriggerRef}
                type='button'
              >
                <span className={!product.category ? S.categoryPlaceholderClassName : undefined}>
                  {product.category || '카테고리'}
                </span>
                {isCategoryDropdownOpen ? (
                  <IcChevronUp aria-hidden='true' />
                ) : (
                  <IcChevronDown aria-hidden='true' />
                )}
              </button>
            </div>
            {productErrorMessages.category && (
              <p className={S.fieldErrorMessageClassName} id={categoryErrorId}>
                <IcCircleExclamationSizeSmallColorNegative
                  className={S.fieldErrorIconClassName}
                  aria-hidden='true'
                />
                <span>{productErrorMessages.category}</span>
              </p>
            )}
          </FieldGroup>
        </div>

        <FieldGroup
          errorMessage={productErrorMessages.description}
          id='today-special-product-description'
          label='상품 한줄 홍보문구'
          onBlur={onDescriptionBlur}
          onChange={onDescriptionChange}
          placeholder='홍보문구를 입력하세요.'
          status={productErrorMessages.description ? 'error' : 'default'}
          value={product.description}
        />
      </div>
    </section>
  );
};
