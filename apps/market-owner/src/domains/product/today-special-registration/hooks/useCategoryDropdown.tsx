import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import { overlay } from 'overlay-kit';

import { CategoryDropdownOverlay } from '../components/CategoryDropdownOverlay';
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
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

  const getCategoryDropdownOverlayStyle = () => {
    const triggerRect = categoryTriggerRef.current?.getBoundingClientRect();

    return {
      '--today-special-category-dropdown-left': `${triggerRect?.left ?? 0}px`,
      '--today-special-category-dropdown-top': `${(triggerRect?.bottom ?? 0) + 8}px`,
    } as CSSProperties;
  };

  // OverlayKit에 등록한 카테고리 드롭다운을 닫고 필요하면 category를 touched 처리
  const closeCategoryDropdown = useCallback(
    (shouldTouchCategory = true) => {
      if (!isCategoryOpen) {
        return;
      }

      overlay.close(categoryOverlayId);
      overlay.unmount(categoryOverlayId);
      setIsCategoryOpen(false);

      if (shouldTouchCategory) {
        handleCategorySelect(selectedCategory);
      }
    },
    [handleCategorySelect, isCategoryOpen, selectedCategory],
  );

  // Trigger 위치 기준으로 OverlayKit에 실제 Dropdown UI를 렌더링
  const openCategoryDropdown = () => {
    setIsCategoryOpen(true);

    overlay.open(
      ({ close, unmount }) => {
        const closeDropdown = () => {
          close();
          unmount();
          setIsCategoryOpen(false);
        };

        return (
          <CategoryDropdownOverlay
            id={categoryDropdownId}
            onClose={closeDropdown}
            onSelect={handleCategorySelect}
            selectedCategory={selectedCategory}
            style={getCategoryDropdownOverlayStyle()}
          />
        );
      },
      { overlayId: categoryOverlayId },
    );
  };

  useEffect(() => {
    if (!isCategoryOpen) {
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

    return () => {
      document.removeEventListener('pointerdown', closeCategoryDropdownOnPointerDown);
      document.removeEventListener('keydown', closeCategoryDropdownOnEscape);
    };
  }, [closeCategoryDropdown, isCategoryOpen]);

  useEffect(() => {
    return () => {
      overlay.close(categoryOverlayId);
      overlay.unmount(categoryOverlayId);
    };
  }, []);

  // Trigger 클릭시 OverlayKit Dropdown을 열거나 닫기
  const handleCategoryTriggerClick = () => {
    if (isCategoryOpen) {
      closeCategoryDropdown();
      return;
    }

    openCategoryDropdown();
  };

  return {
    closeCategoryDropdown,
    productCategoryProps: {
      categoryDropdownId,
      categoryTriggerRef,
      isCategoryOpen,
      onCategoryTriggerClick: handleCategoryTriggerClick,
    },
  };
};
