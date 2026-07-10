import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import { overlay, useOverlayData } from 'overlay-kit';
import type { TodaySpecialRegistrationFormTypes } from '../model';

const categoryDropdownId = 'today-special-product-category-dropdown';
const categoryOverlayId = 'today-special-product-category-dropdown-overlay';
const categoryDropdownGapPx = 8;
const categoryDropdownBottomMarginPx = 39;
const categoryDropdownMinHeightPx = 40;

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
  const overlayData = useOverlayData();
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const isCategoryDropdownOpen = Boolean(overlayData[categoryOverlayId]?.isOpen);
  const [categoryDropdownStyle, setCategoryDropdownStyle] = useState<CSSProperties>({});

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

  const updateCategoryDropdownStyle = useCallback(() => {
    const triggerRect = categoryTriggerRef.current?.getBoundingClientRect();
    const maxHeight =
      triggerRect == null
        ? categoryDropdownMinHeightPx
        : Math.max(
            categoryDropdownMinHeightPx,
            window.innerHeight -
              triggerRect.bottom -
              categoryDropdownGapPx -
              categoryDropdownBottomMarginPx,
          );

    setCategoryDropdownStyle({
      '--today-special-category-dropdown-max-height': `${maxHeight}px`,
    } as CSSProperties);
  }, []);

  const closeCategoryDropdown = useCallback(
    (shouldTouchCategory = true) => {
      if (!isCategoryDropdownOpen) {
        return;
      }

      overlay.close(categoryOverlayId);
      overlay.unmount(categoryOverlayId);

      if (shouldTouchCategory) {
        handleCategorySelect(selectedCategory);
      }
    },
    [handleCategorySelect, isCategoryDropdownOpen, selectedCategory],
  );

  const openCategoryDropdown = () => {
    updateCategoryDropdownStyle();
    overlay.open(() => null, { overlayId: categoryOverlayId });
  };

  useEffect(() => {
    if (!isCategoryDropdownOpen) {
      return;
    }

    const closeCategoryDropdownOnPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest('[data-today-special-category-overlay]') &&
        !target.closest('[data-today-special-category-trigger]')
      ) {
        closeCategoryDropdown();
      }
    };

    const closeCategoryDropdownOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCategoryDropdown();
      }
    };

    document.addEventListener('pointerdown', closeCategoryDropdownOnPointerDown);
    document.addEventListener('keydown', closeCategoryDropdownOnEscape);
    window.addEventListener('resize', updateCategoryDropdownStyle);
    document.addEventListener('scroll', updateCategoryDropdownStyle, true);

    return () => {
      document.removeEventListener('pointerdown', closeCategoryDropdownOnPointerDown);
      document.removeEventListener('keydown', closeCategoryDropdownOnEscape);
      window.removeEventListener('resize', updateCategoryDropdownStyle);
      document.removeEventListener('scroll', updateCategoryDropdownStyle, true);
    };
  }, [closeCategoryDropdown, isCategoryDropdownOpen, updateCategoryDropdownStyle]);

  useEffect(() => {
    return () => {
      overlay.close(categoryOverlayId);
      overlay.unmount(categoryOverlayId);
    };
  }, []);

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
      categoryTriggerRef,
      isCategoryDropdownOpen,
      onCategorySelect: handleCategorySelect,
      onCloseCategoryDropdown: () => closeCategoryDropdown(false),
      onCategoryTriggerClick: handleCategoryTriggerClick,
    },
  };
};
