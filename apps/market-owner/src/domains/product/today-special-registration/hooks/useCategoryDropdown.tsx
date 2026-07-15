import { useCallback, useRef } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import { useProductCategoryDropdownLayout, useProductOverlayDisclosure } from '../../hooks';
import type { TodaySpecialRegistrationFormTypes } from '../model';

const categoryDropdownId = 'today-special-product-category-dropdown';
const categoryOverlayId = 'today-special-product-category-dropdown-overlay';
interface UseCategoryDropdownParams {
  currentIndex: number;
  selectedCategory: string;
  setValue: UseFormSetValue<TodaySpecialRegistrationFormTypes>;
}

export const useCategoryDropdown = ({
  currentIndex,
  selectedCategory,
  setValue,
}: UseCategoryDropdownParams) => {
  const categoryFieldRef = useRef<HTMLDivElement>(null);
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);

  const handleCategorySelect = useCallback(
    (category: string) => {
      setValue(`products.${currentIndex}.category`, category, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [currentIndex, setValue],
  );
  const handleCategoryDismiss = useCallback(() => {
    handleCategorySelect(selectedCategory);
  }, [handleCategorySelect, selectedCategory]);
  const {
    close: closeCategoryOverlay,
    isOpen: isCategoryDropdownOpen,
    open: openCategoryOverlay,
  } = useProductOverlayDisclosure({
    onDismiss: handleCategoryDismiss,
    overlayId: categoryOverlayId,
    triggerRef: categoryFieldRef,
  });
  const categoryDropdownStyle = useProductCategoryDropdownLayout({
    containerRef: categoryFieldRef,
    isOpen: isCategoryDropdownOpen,
    triggerRef: categoryTriggerRef,
  });

  const closeCategoryDropdown = useCallback(
    (shouldTouchCategory = true) => {
      if (!isCategoryDropdownOpen) {
        return;
      }

      if (shouldTouchCategory) {
        handleCategorySelect(selectedCategory);
      }

      closeCategoryOverlay();
    },
    [closeCategoryOverlay, handleCategorySelect, isCategoryDropdownOpen, selectedCategory],
  );

  const openCategoryDropdown = () => {
    openCategoryOverlay();
  };

  const handleCategoryTriggerClick = () => {
    if (isCategoryDropdownOpen) {
      closeCategoryDropdown();
      return;
    }

    openCategoryDropdown();
  };

  return {
    closeCategoryDropdown,
    productCategoryProps: {
      categoryDropdownId,
      categoryDropdownStyle,
      categoryFieldRef,
      categoryTriggerRef,
      isCategoryDropdownOpen,
      onCategorySelect: (category: string) => {
        handleCategorySelect(category);
        closeCategoryDropdown(false);
      },
      onCategoryTriggerClick: handleCategoryTriggerClick,
    },
  };
};
