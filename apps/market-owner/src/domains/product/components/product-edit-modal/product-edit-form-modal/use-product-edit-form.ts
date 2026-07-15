import { useRef, useState, type ChangeEventHandler } from 'react';

import { type OwnerApiTypes } from '@/shared/api';
import { type ImagePreviewChangePayload, useImagePreview } from '@/shared/hooks/useImagePreview';
import { isValidImageUploadFile } from '@/shared/utils/image-upload.utils';

import { type ProductSelectableCategoryTypes } from '../../../constants';
import { useProductCategoryDropdownLayout, useProductOverlayDisclosure } from '../../../hooks';
import {
  addOneDayToProductEditDate,
  isProductEditDateRangeValid,
  isProductEditDateTodayOrFuture,
} from '../../../utils/product-date';
import {
  formatProductPriceInput,
  limitProductNameInput,
  limitProductPromotionTextInput,
} from '../../../utils/product-input';
import { type ProductEditCardVariantTypes } from '../../product-edit-product-list';
import {
  createProductEditInitialValues,
  isSameProductEditFormValues,
  type ProductEditFormValues,
} from './product-edit-form.utils';

export const PRODUCT_EDIT_MODAL_CATEGORY_OVERLAY_ID = 'product-edit-modal-category-dropdown';

interface UseProductEditFormParams {
  detail: OwnerApiTypes.OwnerProductDetailResponse;
  variant: ProductEditCardVariantTypes;
}

export const useProductEditForm = ({ detail, variant }: UseProductEditFormParams) => {
  const [initialValues] = useState(() => createProductEditInitialValues(detail));
  const [values, setValues] = useState(initialValues);
  const categoryFieldRef = useRef<HTMLDivElement>(null);
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const categoryDropdown = useProductOverlayDisclosure({
    overlayId: PRODUCT_EDIT_MODAL_CATEGORY_OVERLAY_ID,
    triggerRef: categoryFieldRef,
  });
  const categoryDropdownStyle = useProductCategoryDropdownLayout({
    containerRef: categoryFieldRef,
    isOpen: categoryDropdown.isOpen,
    triggerRef: categoryTriggerRef,
  });

  const updateValue =
    (key: keyof ProductEditFormValues): ChangeEventHandler<HTMLInputElement> =>
    (event) => {
      const inputValue = event.target.value;
      const isPriceField = key === 'originalPrice' || key === 'salePrice';
      const nextValue =
        key === 'productName'
          ? limitProductNameInput(inputValue)
          : key === 'promotionText'
            ? limitProductPromotionTextInput(inputValue)
            : isPriceField
              ? formatProductPriceInput(inputValue)
              : inputValue;

      setValues((currentValues) => ({
        ...currentValues,
        [key]: nextValue,
      }));
    };

  const selectCategory = (categoryName: ProductSelectableCategoryTypes) => {
    setValues((currentValues) => ({
      ...currentValues,
      categoryName,
    }));
    categoryDropdown.close();
  };

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

  const toggleTodayOnlyPeriod = () => {
    setValues((currentValues) => ({
      ...currentValues,
      endDate:
        currentValues.endDate === currentValues.startDate
          ? addOneDayToProductEditDate(currentValues.endDate)
          : currentValues.startDate,
    }));
  };

  return {
    categoryDropdownStyle,
    categoryFieldRef,
    categoryTriggerRef,
    closeCategoryDropdown: categoryDropdown.close,
    imageInputOnChange: imagePreview.imageInputProps.onChange,
    isCategoryDropdownOpen: categoryDropdown.isOpen,
    isDateRangeValid: isProductEditDateRangeValid(values.startDate, values.endDate),
    isEdited: !isSameProductEditFormValues(values, initialValues),
    isStartDateValid:
      variant === 'todaySpecial' || isProductEditDateTodayOrFuture(values.startDate),
    isTodayOnly: values.startDate === values.endDate,
    selectCategory,
    toggleCategoryDropdown: categoryDropdown.toggle,
    toggleTodayOnlyPeriod,
    updateValue,
    values,
  };
};

export type ProductEditFormControllerTypes = ReturnType<typeof useProductEditForm>;
