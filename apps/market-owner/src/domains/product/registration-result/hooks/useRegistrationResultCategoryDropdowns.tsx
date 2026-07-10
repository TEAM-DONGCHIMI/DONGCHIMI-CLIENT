import { useCallback, useEffect, useRef, type MouseEvent } from 'react';
import { overlay, useOverlayData } from 'overlay-kit';

import type { ProductCategoryGroupTypes } from '@/shared/constants/product-categories';

import {
  CATEGORY_FILTER_DROPDOWN_OVERLAY_ID,
  CategoryFilterDropdown,
  ProductCategoryDropdown,
  getAnchorRect,
} from '../components/RegistrationResultDropdown';
import type { RegistrationResultProduct } from '../fixtures';

interface UseRegistrationResultCategoryDropdownsParams {
  productCategories: ReadonlyMap<string, string>;
  selectedCategoryFilters: ReadonlySet<ProductCategoryGroupTypes>;
  onCategoryFilterChange: (selectedCategories: ReadonlySet<ProductCategoryGroupTypes>) => void;
  onProductCategoryChange: (productId: string, category: ProductCategoryGroupTypes) => void;
}

const getProductCategoryDropdownOverlayId = (productId: string) => {
  return `registration-result-category-dropdown-${productId}`;
};

export const useRegistrationResultCategoryDropdowns = ({
  productCategories,
  selectedCategoryFilters,
  onCategoryFilterChange,
  onProductCategoryChange,
}: UseRegistrationResultCategoryDropdownsParams) => {
  const overlayData = useOverlayData();
  const productCategoryDropdownOverlayIdRef = useRef<string | null>(null);
  const isCategoryFilterDropdownOpen = Boolean(
    overlayData[CATEGORY_FILTER_DROPDOWN_OVERLAY_ID]?.isOpen,
  );

  const closeCategoryFilterDropdown = useCallback(() => {
    overlay.close(CATEGORY_FILTER_DROPDOWN_OVERLAY_ID);
    overlay.unmount(CATEGORY_FILTER_DROPDOWN_OVERLAY_ID);
  }, []);

  const closeProductCategoryDropdown = useCallback((overlayId: string | null) => {
    if (overlayId == null) {
      return;
    }

    overlay.close(overlayId);
    overlay.unmount(overlayId);

    if (productCategoryDropdownOverlayIdRef.current === overlayId) {
      productCategoryDropdownOverlayIdRef.current = null;
    }
  }, []);

  const clearProductCategoryDropdownOverlayId = useCallback((overlayId: string) => {
    if (productCategoryDropdownOverlayIdRef.current === overlayId) {
      productCategoryDropdownOverlayIdRef.current = null;
    }
  }, []);

  const toggleCategoryFilterDropdown = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (isCategoryFilterDropdownOpen) {
        closeCategoryFilterDropdown();

        return;
      }

      const anchorRect = getAnchorRect(event.currentTarget);

      overlay.open(
        ({ isOpen, close, unmount }) => (
          <CategoryFilterDropdown
            anchorRect={anchorRect}
            close={close}
            isOpen={isOpen}
            selectedCategories={selectedCategoryFilters}
            unmount={unmount}
            onSelectionChange={onCategoryFilterChange}
          />
        ),
        { overlayId: CATEGORY_FILTER_DROPDOWN_OVERLAY_ID },
      );
    },
    [
      closeCategoryFilterDropdown,
      isCategoryFilterDropdownOpen,
      onCategoryFilterChange,
      selectedCategoryFilters,
    ],
  );

  const openProductCategoryDropdown = useCallback(
    (product: RegistrationResultProduct) => (event: MouseEvent<HTMLButtonElement>) => {
      const anchorRect = getAnchorRect(event.currentTarget);
      const selectedCategory = productCategories.get(product.id) ?? product.category;
      const overlayId = getProductCategoryDropdownOverlayId(product.id);

      closeProductCategoryDropdown(productCategoryDropdownOverlayIdRef.current);
      productCategoryDropdownOverlayIdRef.current = overlayId;

      overlay.open(
        ({ isOpen, close, unmount }) => (
          <ProductCategoryDropdown
            anchorRect={anchorRect}
            close={close}
            isOpen={isOpen}
            selectedCategory={selectedCategory}
            unmount={unmount}
            onDismiss={() => clearProductCategoryDropdownOverlayId(overlayId)}
            onSelect={(category) => onProductCategoryChange(product.id, category)}
          />
        ),
        { overlayId },
      );
    },
    [
      clearProductCategoryDropdownOverlayId,
      closeProductCategoryDropdown,
      onProductCategoryChange,
      productCategories,
    ],
  );

  useEffect(() => {
    return () => {
      closeCategoryFilterDropdown();
      closeProductCategoryDropdown(productCategoryDropdownOverlayIdRef.current);
    };
  }, [closeCategoryFilterDropdown, closeProductCategoryDropdown]);

  return {
    action: {
      openProductCategoryDropdown,
      toggleCategoryFilterDropdown,
    },
    state: {
      isCategoryFilterDropdownOpen,
    },
  };
};
