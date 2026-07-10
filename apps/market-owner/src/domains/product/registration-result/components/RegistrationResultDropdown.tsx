import { useEffect, useState, type KeyboardEventHandler } from 'react';

import { Dropdown } from '@dongchimi/design-system/components';

import * as S from './RegistrationResult.css';

const ALL_CATEGORY_OPTION = '전체';
const CATEGORY_OPTIONS = [
  '채소･과일',
  '정육･달걀',
  '수산',
  '유제품',
  '간편식',
  '가공식품',
  '음료･주류',
  '생활용품',
  '기타',
] as const;
const PRODUCT_CATEGORY_OPTIONS = [ALL_CATEGORY_OPTION, ...CATEGORY_OPTIONS] as const;
const CATEGORY_DROPDOWN_WIDTH = 206;
const CATEGORY_DROPDOWN_GAP = 8;
const CATEGORY_DROPDOWN_SCREEN_MARGIN = 16;
const CATEGORY_FILTER_DROPDOWN_HEIGHT = 452;
const PRODUCT_CATEGORY_DROPDOWN_HEIGHT = 408;

export const CATEGORY_FILTER_DROPDOWN_ID = 'registration-result-category-filter-dropdown';
export const CATEGORY_FILTER_DROPDOWN_OVERLAY_ID =
  'registration-result-category-filter-dropdown-overlay';

type ProductCategoryOptionTypes = (typeof PRODUCT_CATEGORY_OPTIONS)[number];
export type CategoryOptionTypes = (typeof CATEGORY_OPTIONS)[number];

export interface AnchorRect {
  bottom: number;
  left: number;
  top: number;
}

const productCategoryGroupMap: Record<string, CategoryOptionTypes> = {
  김치: '가공식품',
  '김치/반찬': '가공식품',
  수산: '수산',
  정육: '정육･달걀',
  채소: '채소･과일',
};
const categoryOptionSet: ReadonlySet<string> = new Set(CATEGORY_OPTIONS);

export const getAnchorRect = (element: HTMLElement): AnchorRect => {
  const rect = element.getBoundingClientRect();

  return {
    bottom: rect.bottom,
    left: rect.left,
    top: rect.top,
  };
};

const getDropdownMaxLeft = (anchorRect: AnchorRect) => {
  if (typeof window === 'undefined') {
    return anchorRect.left;
  }

  return window.innerWidth - CATEGORY_DROPDOWN_WIDTH - CATEGORY_DROPDOWN_SCREEN_MARGIN;
};

const getDropdownTop = (anchorRect: AnchorRect, dropdownHeight: number) => {
  const defaultTop = anchorRect.bottom + CATEGORY_DROPDOWN_GAP;
  const shouldFlip =
    typeof window !== 'undefined' &&
    defaultTop + dropdownHeight > window.innerHeight - CATEGORY_DROPDOWN_SCREEN_MARGIN;

  if (!shouldFlip) {
    return defaultTop;
  }

  return Math.max(
    CATEGORY_DROPDOWN_SCREEN_MARGIN,
    anchorRect.top - dropdownHeight - CATEGORY_DROPDOWN_GAP,
  );
};

const getDropdownPositionStyle = (anchorRect: AnchorRect, dropdownHeight: number) => {
  const maxLeft = getDropdownMaxLeft(anchorRect);
  const left = Math.max(CATEGORY_DROPDOWN_SCREEN_MARGIN, Math.min(anchorRect.left, maxLeft));
  const top = getDropdownTop(anchorRect, dropdownHeight);

  return { left, top };
};

const getProductCategoryGroup = (category: string): CategoryOptionTypes => {
  if (categoryOptionSet.has(category)) {
    return category as CategoryOptionTypes;
  }

  return productCategoryGroupMap[category] ?? '기타';
};

export const getProductMatchesCategoryFilter = (
  category: string,
  selectedCategories: ReadonlySet<CategoryOptionTypes>,
) => {
  if (selectedCategories.size === 0) {
    return true;
  }

  return selectedCategories.has(getProductCategoryGroup(category));
};

const getCategoryOptionSelected = (
  option: ProductCategoryOptionTypes,
  selectedCategories: ReadonlySet<CategoryOptionTypes>,
) => {
  if (option === ALL_CATEGORY_OPTION) {
    return selectedCategories.size === 0;
  }

  return selectedCategories.has(option);
};

const useDismissOnEscape = (isOpen: boolean, dismiss: () => void) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss, isOpen]);
};

const getBackdropKeyDownHandler = (dismiss: () => void): KeyboardEventHandler<HTMLDivElement> => {
  return (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.stopPropagation();
    dismiss();
  };
};

export const CategoryFilterDropdown = ({
  anchorRect,
  isOpen,
  selectedCategories,
  close,
  unmount,
  onDismiss,
  onSelectionChange,
}: {
  anchorRect: AnchorRect;
  isOpen: boolean;
  selectedCategories: ReadonlySet<CategoryOptionTypes>;
  close: () => void;
  unmount: () => void;
  onDismiss: () => void;
  onSelectionChange: (selectedCategories: ReadonlySet<CategoryOptionTypes>) => void;
}) => {
  const [currentSelectedCategories, setCurrentSelectedCategories] = useState(
    () => new Set(selectedCategories),
  );
  const dismiss = () => {
    close();
    unmount();
    onDismiss();
  };
  const handleBackdropKeyDown = getBackdropKeyDownHandler(dismiss);

  useDismissOnEscape(isOpen, dismiss);

  if (!isOpen) {
    return null;
  }

  const handleOptionClick = (option: ProductCategoryOptionTypes) => {
    let nextSelectedCategories: Set<CategoryOptionTypes>;

    if (option === ALL_CATEGORY_OPTION) {
      nextSelectedCategories = new Set<CategoryOptionTypes>();
    } else {
      nextSelectedCategories = new Set(currentSelectedCategories);

      if (nextSelectedCategories.has(option)) {
        nextSelectedCategories.delete(option);
      } else {
        nextSelectedCategories.add(option);
      }
    }

    setCurrentSelectedCategories(nextSelectedCategories);
    onSelectionChange(nextSelectedCategories);
  };

  const positionStyle = getDropdownPositionStyle(anchorRect, CATEGORY_FILTER_DROPDOWN_HEIGHT);

  return (
    <div
      className={S.dropdownBackdropClassName}
      onClick={dismiss}
      onKeyDown={handleBackdropKeyDown}
      role='presentation'
    >
      <Dropdown
        aria-label='카테고리 정렬'
        className={S.dropdownPanelClassName}
        id={CATEGORY_FILTER_DROPDOWN_ID}
        onClick={(event) => event.stopPropagation()}
        role='group'
        style={positionStyle}
      >
        {PRODUCT_CATEGORY_OPTIONS.map((option) => {
          const selected = getCategoryOptionSelected(option, currentSelectedCategories);

          return (
            <Dropdown.Item
              checkbox
              key={option}
              onClick={() => handleOptionClick(option)}
              selected={selected}
            >
              {option}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </div>
  );
};

export const ProductCategoryDropdown = ({
  anchorRect,
  isOpen,
  selectedCategory,
  close,
  unmount,
  onSelect,
}: {
  anchorRect: AnchorRect;
  isOpen: boolean;
  selectedCategory: string;
  close: () => void;
  unmount: () => void;
  onSelect: (category: CategoryOptionTypes) => void;
}) => {
  const dismiss = () => {
    close();
    unmount();
  };
  const handleBackdropKeyDown = getBackdropKeyDownHandler(dismiss);

  useDismissOnEscape(isOpen, dismiss);

  if (!isOpen) {
    return null;
  }

  const positionStyle = getDropdownPositionStyle(anchorRect, PRODUCT_CATEGORY_DROPDOWN_HEIGHT);

  return (
    <div
      className={S.dropdownBackdropClassName}
      onClick={dismiss}
      onKeyDown={handleBackdropKeyDown}
      role='presentation'
    >
      <Dropdown
        aria-label='상품 카테고리'
        className={S.dropdownPanelClassName}
        onClick={(event) => event.stopPropagation()}
        role='menu'
        style={positionStyle}
      >
        {PRODUCT_CATEGORY_OPTIONS.map((option) => {
          if (option === ALL_CATEGORY_OPTION) {
            return null;
          }

          return (
            <Dropdown.Item
              color='primary'
              key={option}
              onClick={() => {
                onSelect(option);
                dismiss();
              }}
              selected={selectedCategory === option}
            >
              {option}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </div>
  );
};
