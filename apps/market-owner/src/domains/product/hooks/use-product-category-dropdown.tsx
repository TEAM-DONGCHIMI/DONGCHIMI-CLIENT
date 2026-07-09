import { type RefObject, useCallback, useEffect, useState } from 'react';
import { overlay, useOverlayData } from 'overlay-kit';

import { type ProductCategoryTypes } from '../constants';

const CATEGORY_DROPDOWN_OVERLAY_ID = 'product-category-dropdown';

export const useProductCategoryDropdown = (categoryFilterRef: RefObject<HTMLDivElement | null>) => {
  const overlayData = useOverlayData();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryTypes | null>(null);
  const isCategoryDropdownOpen = Boolean(overlayData[CATEGORY_DROPDOWN_OVERLAY_ID]?.isOpen);

  const closeCategoryDropdown = useCallback(() => {
    overlay.close(CATEGORY_DROPDOWN_OVERLAY_ID);
    overlay.unmount(CATEGORY_DROPDOWN_OVERLAY_ID);
  }, []);

  const toggleCategoryDropdown = useCallback(() => {
    if (isCategoryDropdownOpen) {
      closeCategoryDropdown();
      return;
    }

    overlay.open(() => null, { overlayId: CATEGORY_DROPDOWN_OVERLAY_ID });
  }, [closeCategoryDropdown, isCategoryDropdownOpen]);

  const selectCategory = useCallback(
    (category: ProductCategoryTypes | null) => {
      setSelectedCategory(category);
      closeCategoryDropdown();
    },
    [closeCategoryDropdown],
  );

  useEffect(() => {
    if (!isCategoryDropdownOpen) {
      return;
    }

    const closeCategoryDropdownOnPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (!categoryFilterRef.current?.contains(target)) {
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

    return () => {
      document.removeEventListener('pointerdown', closeCategoryDropdownOnPointerDown);
      document.removeEventListener('keydown', closeCategoryDropdownOnEscape);
    };
  }, [categoryFilterRef, closeCategoryDropdown, isCategoryDropdownOpen]);

  return {
    closeCategoryDropdown,
    isCategoryDropdownOpen,
    selectCategory,
    selectedCategory,
    toggleCategoryDropdown,
  };
};
