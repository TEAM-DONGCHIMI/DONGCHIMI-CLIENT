import { useEffect, useRef, type MouseEvent } from 'react';
import { overlay, useOverlayData } from 'overlay-kit';

import type { ProductCategoryGroupTypes } from '@/shared/constants/product-categories';

import {
  CATEGORY_FILTER_DROPDOWN_OVERLAY_ID,
  CategoryFilterDropdown,
  ProductCategoryDropdown,
  getAnchorRect,
} from '../components/RegistrationResultDropdown';
import type { RegistrationResultProduct } from '../fixtures';
import {
  getRegistrationResultProductFieldValue,
  type RegistrationResultProductDraftMapTypes,
} from './useRegistrationResultProductDrafts';

interface UseRegistrationResultCategoryDropdownsParams {
  productDrafts: RegistrationResultProductDraftMapTypes;
  selectedCategoryFilters: ReadonlySet<ProductCategoryGroupTypes>;
  onCategoryFilterChange: (selectedCategories: ReadonlySet<ProductCategoryGroupTypes>) => void;
  onProductCategoryChange: (productId: string, category: ProductCategoryGroupTypes) => void;
}

const getProductCategoryDropdownOverlayId = (productId: string) => {
  return `registration-result-category-dropdown-${productId}`;
};

const closeCategoryFilterDropdownOverlay = () => {
  overlay.close(CATEGORY_FILTER_DROPDOWN_OVERLAY_ID);
  overlay.unmount(CATEGORY_FILTER_DROPDOWN_OVERLAY_ID);
};

const closeProductCategoryDropdownOverlay = (overlayId: string | null) => {
  if (overlayId == null) {
    return;
  }

  overlay.close(overlayId);
  overlay.unmount(overlayId);
};

export const useRegistrationResultCategoryDropdowns = ({
  productDrafts,
  selectedCategoryFilters,
  onCategoryFilterChange,
  onProductCategoryChange,
}: UseRegistrationResultCategoryDropdownsParams) => {
  const overlayData = useOverlayData();
  const productCategoryDropdownOverlayIdRef = useRef<string | null>(null);
  const isCategoryFilterDropdownOpen = Boolean(
    overlayData[CATEGORY_FILTER_DROPDOWN_OVERLAY_ID]?.isOpen,
  );

  const closeProductCategoryDropdown = (overlayId: string | null) => {
    closeProductCategoryDropdownOverlay(overlayId);
    if (productCategoryDropdownOverlayIdRef.current === overlayId) {
      productCategoryDropdownOverlayIdRef.current = null;
    }
  };

  const clearProductCategoryDropdownOverlayId = (overlayId: string) => {
    if (productCategoryDropdownOverlayIdRef.current === overlayId) {
      productCategoryDropdownOverlayIdRef.current = null;
    }
  };

  const toggleCategoryFilterDropdown = (event: MouseEvent<HTMLButtonElement>) => {
    if (isCategoryFilterDropdownOpen) {
      closeCategoryFilterDropdownOverlay();

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
  };

  const openProductCategoryDropdown =
    (product: RegistrationResultProduct) => (event: MouseEvent<HTMLButtonElement>) => {
      const anchorRect = getAnchorRect(event.currentTarget);
      const selectedCategory = getRegistrationResultProductFieldValue(
        product,
        productDrafts,
        'category',
      );
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
    };

  useEffect(() => {
    return () => {
      closeCategoryFilterDropdownOverlay();
      closeProductCategoryDropdownOverlay(productCategoryDropdownOverlayIdRef.current);
    };
  }, []);

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
