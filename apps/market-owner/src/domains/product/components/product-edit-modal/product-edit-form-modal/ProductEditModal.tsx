import { useRef, useState, type ChangeEventHandler } from 'react';

import { Button, Dialog, InlineField } from '@dongchimi/design-system/components';
import {
  IcCalendarPlusSizeSmall,
  IcChevronDownSizeSmallColor50,
  IcLineHorizontalSizeSmall,
} from '@dongchimi/design-system/icons';

import { type ImagePreviewChangePayload, useImagePreview } from '@/shared/hooks/useImagePreview';
import { imageUploadInputAccept, isValidImageUploadFile } from '@/shared/utils/image-upload.utils';

import {
  isProductSelectableCategory,
  productSelectableCategoryOptions,
  type ProductSelectableCategoryTypes,
} from '../../../constants';
import { useProductOverlayDisclosure } from '../../../hooks';
import {
  addOneDayToProductEditDate,
  formatProductEditDateForInput,
} from '../../../utils/product-edit-date';
import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
} from '../../product-edit-product-list';
import { DateField } from '../../date-field';
import { ProductCategoryDropdown } from '../../product-category-dropdown';
import { ProductImageUploadField } from '../../product-image-upload-field';
import { useProductEditModalTitleFocus } from '../hooks/use-product-edit-modal-title-focus';
import { keepProductEditDialogOpen, openProductEditOverlay } from '../open-product-edit-overlay';
import * as S from './ProductEditModal.css';

interface ProductEditModalProps {
  open: boolean;
  product: ProductEditCardProps;
  variant: ProductEditCardVariantTypes;
  onClose: () => void;
  onSubmit?: (product: ProductEditCardProps) => void;
}

interface OpenProductEditModalParams {
  product: ProductEditCardProps;
  onSubmit?: (product: ProductEditCardProps) => void;
  variant: ProductEditCardVariantTypes;
}

interface ProductEditFormValues {
  categoryName: ProductSelectableCategoryTypes;
  endDate: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  originalPrice: string;
  productName: string;
  promotionText: string;
  salePrice: string;
  startDate: string;
}

const DEFAULT_PROMOTION_TEXT = '아주 맛있는 딸기 착한 가격에 데려가세요!';
const PRODUCT_EDIT_MODAL_CATEGORY_OVERLAY_ID = 'product-edit-modal-category-dropdown';

const createInitialValues = (
  product: ProductEditCardProps,
  variant: ProductEditCardVariantTypes,
): ProductEditFormValues => {
  const categoryName =
    product.categoryName != null && isProductSelectableCategory(product.categoryName)
      ? product.categoryName
      : '기타';
  const endDate = formatProductEditDateForInput(product.endDate);

  return {
    categoryName,
    endDate,
    imageFile: null,
    imagePreviewUrl: null,
    originalPrice: product.originalPrice ?? '',
    productName: product.productName,
    promotionText: variant === 'todaySpecial' ? DEFAULT_PROMOTION_TEXT : '',
    salePrice: product.salePrice,
    startDate: formatProductEditDateForInput(product.startDate ?? product.endDate),
  };
};

const isSameFormValues = (values: ProductEditFormValues, initialValues: ProductEditFormValues) => {
  return (Object.keys(initialValues) as (keyof ProductEditFormValues)[]).every(
    (key) => values[key] === initialValues[key],
  );
};

export const ProductEditModal = ({
  open,
  product,
  variant,
  onClose,
  onSubmit,
}: ProductEditModalProps) => {
  const [initialValues] = useState(() => createInitialValues(product, variant));
  const [values, setValues] = useState(initialValues);
  const categoryFieldRef = useRef<HTMLDivElement>(null);
  const titleRef = useProductEditModalTitleFocus(open);
  const categoryDropdown = useProductOverlayDisclosure({
    overlayId: PRODUCT_EDIT_MODAL_CATEGORY_OVERLAY_ID,
    triggerRef: categoryFieldRef,
  });
  const isTodaySpecial = variant === 'todaySpecial';
  const isTodayOnly = values.startDate === values.endDate;
  const isEdited = !isSameFormValues(values, initialValues);
  const handleImagePreviewChange = ({ file, previewUrl }: ImagePreviewChangePayload) => {
    setValues((currentValues) => ({
      ...currentValues,
      imageFile: file,
      imagePreviewUrl: previewUrl,
    }));
  };
  const imagePreview = useImagePreview({
    currentPreviewUrl: values.imagePreviewUrl,
    isValidFile: isValidImageUploadFile,
    onPreviewChange: handleImagePreviewChange,
    previewUrls: [values.imagePreviewUrl],
  });

  const closeModal = () => {
    categoryDropdown.close();
    onClose();
  };

  const updateValue =
    (key: keyof ProductEditFormValues): ChangeEventHandler<HTMLInputElement> =>
    (event) => {
      setValues((currentValues) => ({
        ...currentValues,
        [key]: event.target.value,
      }));
    };

  const selectCategory = (categoryName: ProductSelectableCategoryTypes) => {
    setValues((currentValues) => ({
      ...currentValues,
      categoryName,
    }));
    categoryDropdown.close();
  };

  const toggleTodayOnlyPeriod = () => {
    setValues((currentValues) => ({
      ...currentValues,
      endDate:
        currentValues.endDate === currentValues.startDate
          ? addOneDayToProductEditDate(currentValues.endDate)
          : currentValues.startDate,
    }));
  };

  const submitModal = () => {
    onSubmit?.({
      ...product,
      categoryName: values.categoryName,
      endDate: values.endDate,
      originalPrice: values.originalPrice === '' ? undefined : values.originalPrice,
      productName: values.productName,
      salePrice: values.salePrice,
      startDate: values.startDate,
    });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={keepProductEditDialogOpen}>
      <Dialog.Content className={S.contentClassName}>
        <div className={S.containerClassName}>
          <Dialog.Title ref={titleRef} className={S.titleClassName} tabIndex={-1}>
            판매 정보를 수정해주세요
          </Dialog.Title>

          <div className={S.bodyClassName}>
            <section className={S.sectionClassName}>
              <h3 className={S.sectionTitleClassName}>상품 정보</h3>
              <div className={S.formColumnClassName}>
                <ProductImageUploadField
                  accept={imageUploadInputAccept}
                  id='product-edit-modal-image'
                  label='상품 이미지'
                  previewUrl={values.imagePreviewUrl}
                  variant='editModal'
                  onImageChange={imagePreview.imageInputProps.onChange}
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
                    <button
                      aria-expanded={categoryDropdown.isOpen}
                      className={S.categoryTriggerClassName}
                      type='button'
                      onClick={categoryDropdown.toggle}
                    >
                      <span>{values.categoryName}</span>
                      <IcChevronDownSizeSmallColor50 aria-hidden='true' />
                    </button>

                    {categoryDropdown.isOpen && (
                      <ProductCategoryDropdown
                        ariaLabel='상품 구분 선택'
                        className={S.categoryDropdownClassName}
                        options={productSelectableCategoryOptions}
                        selectedCategory={values.categoryName}
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

            <section className={S.sectionClassName}>
              <h3 className={S.sectionTitleClassName}>상품 가격</h3>
              <div className={S.formColumnClassName}>
                <div className={S.priceGridRecipe({ variant })}>
                  {isTodaySpecial && (
                    <div className={S.fieldGroupClassName}>
                      <span className={S.fieldLabelClassName}>원가</span>
                      <InlineField
                        aria-label='원가'
                        inputMode='numeric'
                        unit='원'
                        value={values.originalPrice}
                        onChange={updateValue('originalPrice')}
                      />
                    </div>
                  )}
                  <div className={S.fieldGroupClassName}>
                    <span className={S.fieldLabelClassName}>
                      {isTodaySpecial ? '오늘의 특가' : '판매가'}
                    </span>
                    <InlineField
                      aria-label={isTodaySpecial ? '오늘의 특가' : '판매가'}
                      inputMode='numeric'
                      unit='원'
                      value={values.salePrice}
                      onChange={updateValue('salePrice')}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className={S.sectionClassName}>
              <h3 className={S.sectionTitleClassName}>기간 설정</h3>
              <div className={S.formColumnClassName}>
                <div className={S.fieldGroupClassName}>
                  <span className={S.fieldLabelClassName}>행사 기간</span>
                  <div className={S.dateRowClassName}>
                    <div className={S.dateRangeClassName}>
                      <DateField
                        ariaLabel='행사 시작일'
                        className={S.dateFieldClassName}
                        readOnly={isTodaySpecial}
                        value={values.startDate}
                        onChange={updateValue('startDate')}
                      />
                      <span className={S.dateDividerClassName}>~</span>
                      <DateField
                        ariaLabel='행사 종료일'
                        className={S.dateFieldClassName}
                        value={values.endDate}
                        onChange={updateValue('endDate')}
                      />
                    </div>
                    {isTodaySpecial && (
                      <Button
                        className={S.periodToggleButtonClassName}
                        color='assistive'
                        rightIcon={
                          isTodayOnly ? (
                            <IcCalendarPlusSizeSmall aria-hidden='true' />
                          ) : (
                            <IcLineHorizontalSizeSmall aria-hidden='true' />
                          )
                        }
                        size='small'
                        type='button'
                        variant='outlined'
                        onClick={toggleTodayOnlyPeriod}
                      >
                        {isTodayOnly ? '하루 더 늘리기' : '오늘만 특가로'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className={S.footerClassName}>
            <Button
              className={S.footerButtonClassName}
              color='assistive'
              size='small'
              variant='outlined'
              onClick={closeModal}
            >
              취소
            </Button>
            <Button
              className={S.footerButtonClassName}
              disabled={!isEdited}
              size='small'
              variant='solid'
              onClick={submitModal}
            >
              변경하기
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export const openProductEditModal = ({
  product,
  variant,
  onSubmit,
}: OpenProductEditModalParams) => {
  openProductEditOverlay({
    render: ({ closeOverlay, isOpen }) => (
      <ProductEditModal
        open={isOpen}
        product={product}
        variant={variant}
        onClose={closeOverlay}
        onSubmit={onSubmit}
      />
    ),
  });
};
