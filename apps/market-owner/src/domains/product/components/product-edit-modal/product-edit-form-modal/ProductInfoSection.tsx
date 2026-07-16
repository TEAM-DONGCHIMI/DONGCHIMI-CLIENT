import { InlineField } from '@dongchimi/design-system/components';

import { imageUploadInputAccept } from '@/shared/utils/image-upload.utils';

import { productSelectableCategoryOptions } from '../../../constants';
import { ProductCategoryDropdown, ProductCategoryTrigger } from '../../product-category-dropdown';
import { ProductImageUploadField } from '../../product-image-upload-field';
import * as S from './ProductEditModal.css';
import {
  PRODUCT_EDIT_MODAL_CATEGORY_OVERLAY_ID,
  type ProductEditFormControllerTypes,
} from './use-product-edit-form';

type ProductInfoSectionProps = Pick<
  ProductEditFormControllerTypes,
  | 'categoryDropdownStyle'
  | 'categoryFieldRef'
  | 'categoryTriggerRef'
  | 'imageInputOnChange'
  | 'isCategoryDropdownOpen'
  | 'selectCategory'
  | 'toggleCategoryDropdown'
  | 'updateValue'
  | 'values'
>;

export const ProductInfoSection = ({
  categoryDropdownStyle,
  categoryFieldRef,
  categoryTriggerRef,
  imageInputOnChange,
  isCategoryDropdownOpen,
  selectCategory,
  toggleCategoryDropdown,
  updateValue,
  values,
}: ProductInfoSectionProps) => {
  return (
    <section className={S.sectionClassName}>
      <h3 className={S.sectionTitleClassName}>상품 정보</h3>
      <div className={S.formColumnClassName}>
        <ProductImageUploadField
          accept={imageUploadInputAccept}
          id='product-edit-modal-image'
          label='상품 이미지'
          previewUrl={values.imagePreviewUrl}
          variant='editModal'
          onImageChange={imageInputOnChange}
        />
        <div className={S.productInfoGridClassName}>
          <div className={S.fieldGroupClassName}>
            <span className={S.fieldLabelClassName}>상품명</span>
            <InlineField
              aria-label='상품명'
              value={values.productName}
              onChange={updateValue('productName')}
            />
          </div>
          <div ref={categoryFieldRef} className={S.categoryFieldClassName}>
            <span className={S.fieldLabelClassName}>상품 구분</span>
            <ProductCategoryTrigger
              aria-controls={PRODUCT_EDIT_MODAL_CATEGORY_OVERLAY_ID}
              aria-expanded={isCategoryDropdownOpen}
              label={values.categoryName}
              onClick={toggleCategoryDropdown}
              ref={categoryTriggerRef}
            />

            {isCategoryDropdownOpen && (
              <ProductCategoryDropdown
                ariaLabel='상품 구분 선택'
                className={S.categoryDropdownClassName}
                id={PRODUCT_EDIT_MODAL_CATEGORY_OVERLAY_ID}
                options={productSelectableCategoryOptions}
                selectedCategory={values.categoryName}
                style={categoryDropdownStyle}
                onSelect={selectCategory}
              />
            )}
          </div>
        </div>

        <div className={S.fieldGroupClassName}>
          <span className={S.fieldLabelClassName}>상품 한줄 홍보글</span>
          <InlineField
            aria-label='상품 한줄 홍보글'
            value={values.promotionText}
            onChange={updateValue('promotionText')}
          />
        </div>
      </div>
    </section>
  );
};
