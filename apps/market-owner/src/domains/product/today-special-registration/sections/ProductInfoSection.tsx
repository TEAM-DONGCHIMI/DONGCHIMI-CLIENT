import type { ChangeEventHandler, FocusEventHandler, MouseEventHandler, RefObject } from 'react';

import { InlineField } from '@dongchimi/design-system/components';
import { cn } from '@dongchimi/design-system/styles';
import {
  IcCamera,
  IcChevronDown,
  IcChevronUp,
  IcCircleExclamationSizeSmallColorNegative,
  IcPlus,
} from '@dongchimi/design-system/icons';

import {
  todaySpecialImageInputAccept,
  type TodaySpecialProductErrorMessageTypes,
  type TodaySpecialProductFormTypes,
} from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductInfoSectionProps {
  categoryDropdownId: string;
  categoryTriggerRef: RefObject<HTMLButtonElement | null>;
  isCategoryOpen: boolean;
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
  isCategoryOpen,
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
          <div className={S.fieldGroupClassName}>
            <label className={S.fieldLabelClassName} htmlFor='today-special-product-name'>
              상품명
            </label>
            <InlineField
              aria-label='상품명'
              errorMessage={productErrorMessages.name}
              id='today-special-product-name'
              onBlur={onNameBlur}
              onChange={onNameChange}
              placeholder='상품명을 입력하세요.'
              status={productErrorMessages.name ? 'error' : 'default'}
              value={product.name}
            />
          </div>

          <div className={S.fieldGroupClassName}>
            <span className={S.fieldLabelClassName}>상품 구분</span>
            <div className={S.categoryWrapperClassName}>
              <button
                aria-describedby={productErrorMessages.category ? categoryErrorId : undefined}
                aria-controls={isCategoryOpen ? categoryDropdownId : undefined}
                aria-expanded={isCategoryOpen}
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
                {isCategoryOpen ? (
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
          </div>
        </div>

        <div className={S.fieldGroupClassName}>
          <label className={S.fieldLabelClassName} htmlFor='today-special-product-description'>
            상품 한줄 홍보문구
          </label>
          <InlineField
            aria-label='상품 한줄 홍보문구'
            errorMessage={productErrorMessages.description}
            id='today-special-product-description'
            onBlur={onDescriptionBlur}
            onChange={onDescriptionChange}
            placeholder='홍보문구를 입력하세요.'
            status={productErrorMessages.description ? 'error' : 'default'}
            value={product.description}
          />
        </div>
      </div>
    </section>
  );
};
