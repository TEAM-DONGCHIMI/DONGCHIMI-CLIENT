import { type RefObject, useCallback, useState } from 'react';

import { type ProductCategoryTypes } from '../constants';
import { useProductOverlayDisclosure } from './use-product-overlay-disclosure';

const CATEGORY_DROPDOWN_OVERLAY_ID = 'product-category-dropdown';

export const useProductCategoryDropdown = (categoryFilterRef: RefObject<HTMLDivElement | null>) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryTypes | null>(null);
  const categoryDropdown = useProductOverlayDisclosure({
    overlayId: CATEGORY_DROPDOWN_OVERLAY_ID,
    triggerRef: categoryFilterRef,
  });
  const closeCategoryDropdown = categoryDropdown.close;

  const selectCategory = useCallback(
    (category: ProductCategoryTypes | null) => {
      setSelectedCategory(category);
      closeCategoryDropdown();
    },
    [closeCategoryDropdown],
  );

  return {
    closeCategoryDropdown,
    isCategoryDropdownOpen: categoryDropdown.isOpen,
    selectCategory,
    selectedCategory,
    toggleCategoryDropdown: categoryDropdown.toggle,
  };
};
