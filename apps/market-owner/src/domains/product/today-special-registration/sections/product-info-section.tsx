import type {
  ChangeEventHandler,
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
  RefObject,
} from 'react';

import { cn } from '@dongchimi/design-system/styles';
import { IcCircleExclamationSizeSmallColorNegative } from '@dongchimi/design-system/icons';

import { imageUploadInputAccept } from '@/shared/utils/image-upload.utils';

import { ProductImageUploadField } from '../../components/product-image-upload-field';
import {
  ProductCategoryDropdown,
  ProductCategoryTrigger,
} from '../../components/product-category-dropdown';
import { productSelectableCategoryOptions } from '../../constants';
import { productNameMaxLength, productPromotionTextMaxLength } from '../../utils/product-input';
import { FieldGroup } from '../components/field-group';
import {
  type TodaySpecialProductErrorMessageTypes,
  type TodaySpecialProductFormTypes,
} from '../model';
import * as S from '../today-special-registration-page.css';

interface ProductInfoSectionProps {
  categoryDropdownId: string;
  categoryDropdownStyle: CSSProperties;
  categoryFieldRef: RefObject<HTMLDivElement | null>;
  categoryTriggerRef: RefObject<HTMLButtonElement | null>;
  isCategoryDropdownOpen: boolean;
  onCategorySelect: (category: string) => void;
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
  categoryFieldRef,
  categoryTriggerRef,
  isCategoryDropdownOpen,
  onCategorySelect,
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
              maxLength={productNameMaxLength}
              onBlur={onNameBlur}
              onChange={onNameChange}
              placeholder='상품명을 입력하세요.'
              status={productErrorMessages.name ? 'error' : 'default'}
              value={product.name}
            />

            <FieldGroup label='상품 구분'>
              <div className={S.categoryFieldControlClassName}>
                <div ref={categoryFieldRef} className={S.categoryWrapperClassName}>
                  <ProductCategoryTrigger
                    aria-describedby={productErrorMessages.category ? categoryErrorId : undefined}
                    aria-controls={isCategoryDropdownOpen ? categoryDropdownId : undefined}
                    aria-expanded={isCategoryDropdownOpen}
                    className={cn(productErrorMessages.category && S.categoryTriggerErrorClassName)}
                    data-today-special-category-trigger
                    label={product.category || '카테고리'}
                    onClick={onCategoryTriggerClick}
                    placeholder={!product.category}
                    ref={categoryTriggerRef}
                  />

                  {isCategoryDropdownOpen && (
                    <ProductCategoryDropdown
                      ariaLabel='상품 구분 선택'
                      className={S.categoryDropdownClassName}
                      id={categoryDropdownId}
                      options={productSelectableCategoryOptions}
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
              </div>
            </FieldGroup>
          </div>

          <div className={S.productPromotionFieldSlotClassName}>
            <FieldGroup
              errorMessage={productErrorMessages.description}
              id='today-special-product-description'
              label='상품 한줄 홍보글'
              maxLength={productPromotionTextMaxLength}
              onBlur={onDescriptionBlur}
              onChange={onDescriptionChange}
              optional
              placeholder='홍보문구를 입력하세요.'
              status={productErrorMessages.description ? 'error' : 'default'}
              value={product.description}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
