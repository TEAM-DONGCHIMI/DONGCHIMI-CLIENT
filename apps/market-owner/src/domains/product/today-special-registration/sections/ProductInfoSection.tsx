import type {
  ChangeEventHandler,
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
  RefObject,
} from 'react';

import { cn } from '@dongchimi/design-system/styles';
import {
  IcChevronDown,
  IcChevronUp,
  IcCircleExclamationSizeSmallColorNegative,
} from '@dongchimi/design-system/icons';

import { imageUploadInputAccept } from '@/shared/utils/image-upload.utils';

import { ProductImageUploadField } from '../../components/product-image-upload-field';
import { CategoryDropdownOverlay } from '../components/CategoryDropdownOverlay';
import { FieldGroup } from '../components/FieldGroup';
import {
  type TodaySpecialProductErrorMessageTypes,
  type TodaySpecialProductFormTypes,
} from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductInfoSectionProps {
  categoryDropdownId: string;
  categoryDropdownStyle: CSSProperties;
  categoryTriggerRef: RefObject<HTMLButtonElement | null>;
  isCategoryDropdownOpen: boolean;
  onCategorySelect: (category: string) => void;
  onCloseCategoryDropdown: () => void;
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
  categoryDropdownStyle,
  categoryTriggerRef,
  isCategoryDropdownOpen,
  onCategorySelect,
  onCloseCategoryDropdown,
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
        <ProductImageUploadField
          accept={imageUploadInputAccept}
          description={
            <>
              권장 비율 4:3 1200 x 900px 이상을 권장해요.
              <br />
              이미지를 등록하지 않으면 기본 이미지가 사용돼요.
            </>
          }
          id='today-special-product-image'
          label='상품 이미지'
          previewAlt='등록할 상품 이미지 미리보기'
          previewUrl={product.imagePreviewUrl}
          onImageChange={onImageChange}
        />

        <div className={S.productInfoFieldRowsClassName}>
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

                {isCategoryDropdownOpen && (
                  <CategoryDropdownOverlay
                    id={categoryDropdownId}
                    onClose={onCloseCategoryDropdown}
                    onSelect={onCategorySelect}
                    selectedCategory={product.category}
                    style={categoryDropdownStyle}
                  />
                )}
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
      </div>
    </section>
  );
};
