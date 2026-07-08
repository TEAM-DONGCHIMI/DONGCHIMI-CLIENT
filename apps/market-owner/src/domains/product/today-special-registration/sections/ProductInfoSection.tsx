import { useEffect, useId, useRef, type ChangeEventHandler, type FocusEventHandler } from 'react';

import { Dropdown, InlineField } from '@dongchimi/design-system/components';
import { cn } from '@dongchimi/design-system/styles';
import { IcCamera, IcChevronDown, IcChevronUp, IcPlus } from '@dongchimi/design-system/icons';

import { todaySpecialCategoryOptions } from '../fixtures';
import type { TodaySpecialProductErrorMessageTypes, TodaySpecialProductForm } from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductInfoSectionProps {
  isCategoryOpen: boolean;
  onCategoryOpenChange: (isOpen: boolean) => void;
  onCategorySelect: (category: string) => void;
  onDescriptionBlur: FocusEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLInputElement>;
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  onNameBlur: FocusEventHandler<HTMLInputElement>;
  onNameChange: ChangeEventHandler<HTMLInputElement>;
  product: TodaySpecialProductForm;
  productErrorMessages: TodaySpecialProductErrorMessageTypes;
}

export const ProductInfoSection = ({
  isCategoryOpen,
  onCategoryOpenChange,
  onCategorySelect,
  onDescriptionBlur,
  onDescriptionChange,
  onImageChange,
  onNameBlur,
  onNameChange,
  product,
  productErrorMessages,
}: ProductInfoSectionProps) => {
  const categoryWrapperRef = useRef<HTMLDivElement>(null);
  const categoryDropdownId = useId();
  const nameErrorId = 'today-special-product-name-error';
  const categoryErrorId = 'today-special-product-category-error';
  const descriptionErrorId = 'today-special-product-description-error';

  useEffect(() => {
    if (!isCategoryOpen) {
      return;
    }

    const closeCategoryDropdownOnOutsidePointerDown = (event: PointerEvent) => {
      if (!categoryWrapperRef.current?.contains(event.target as Node)) {
        onCategoryOpenChange(false);
      }
    };

    const closeCategoryDropdownOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCategoryOpenChange(false);
      }
    };

    document.addEventListener('pointerdown', closeCategoryDropdownOnOutsidePointerDown);
    document.addEventListener('keydown', closeCategoryDropdownOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeCategoryDropdownOnOutsidePointerDown);
      document.removeEventListener('keydown', closeCategoryDropdownOnEscape);
    };
  }, [isCategoryOpen, onCategoryOpenChange]);

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
            accept='.jpg,.jpeg,.png,image/jpeg,image/png'
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
              aria-describedby={productErrorMessages.name ? nameErrorId : undefined}
              id='today-special-product-name'
              onBlur={onNameBlur}
              onChange={onNameChange}
              placeholder='상품명을 입력하세요.'
              status={productErrorMessages.name ? 'error' : 'default'}
              value={product.name}
            />
            {productErrorMessages.name && (
              <p className={S.fieldErrorMessageClassName} id={nameErrorId}>
                {productErrorMessages.name}
              </p>
            )}
          </div>

          <div className={S.fieldGroupClassName}>
            <span className={S.fieldLabelClassName}>상품 구분</span>
            <div className={S.categoryWrapperClassName} ref={categoryWrapperRef}>
              <button
                aria-describedby={productErrorMessages.category ? categoryErrorId : undefined}
                aria-controls={isCategoryOpen ? categoryDropdownId : undefined}
                aria-expanded={isCategoryOpen}
                className={cn(
                  S.categoryTriggerClassName,
                  productErrorMessages.category && S.categoryTriggerErrorClassName,
                )}
                onClick={() => onCategoryOpenChange(!isCategoryOpen)}
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

              {isCategoryOpen && (
                <Dropdown className={S.categoryDropdownClassName} id={categoryDropdownId}>
                  {todaySpecialCategoryOptions.map((category) => (
                    <Dropdown.Item
                      className={S.categoryDropdownItemClassName}
                      color='primary'
                      key={category}
                      onClick={() => onCategorySelect(category)}
                      selected={category === product.category}
                    >
                      {category}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              )}
            </div>
            {productErrorMessages.category && (
              <p className={S.fieldErrorMessageClassName} id={categoryErrorId}>
                {productErrorMessages.category}
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
            aria-describedby={productErrorMessages.description ? descriptionErrorId : undefined}
            id='today-special-product-description'
            onBlur={onDescriptionBlur}
            onChange={onDescriptionChange}
            placeholder='홍보문구를 입력하세요.'
            status={productErrorMessages.description ? 'error' : 'default'}
            value={product.description}
          />
          {productErrorMessages.description && (
            <p className={S.fieldErrorMessageClassName} id={descriptionErrorId}>
              {productErrorMessages.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
