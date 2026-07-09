import { useState } from 'react';

import { Dropdown } from '@dongchimi/design-system/components';

import * as S from './RegistrationResultSection.css';

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

export const SORT_DROPDOWN_ID = 'registration-result-category-filter-dropdown';
export const SORT_DROPDOWN_OVERLAY_ID = 'registration-result-sort-dropdown-overlay';

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

  if (!isOpen) {
    return null;
  }

  const dismiss = () => {
    close();
    unmount();
    onDismiss();
  };

  const handleOptionClick = (option: ProductCategoryOptionTypes) => {
    setCurrentSelectedCategories((previousSelectedCategories) => {
      if (option === ALL_CATEGORY_OPTION) {
        const nextSelectedCategories = new Set<CategoryOptionTypes>();

        onSelectionChange(nextSelectedCategories);

        return nextSelectedCategories;
      }

      const nextSelectedCategories = new Set(previousSelectedCategories);

      if (nextSelectedCategories.has(option)) {
        nextSelectedCategories.delete(option);
      } else {
        nextSelectedCategories.add(option);
      }

      onSelectionChange(nextSelectedCategories);

      return nextSelectedCategories;
    });
  };

  const positionStyle = getDropdownPositionStyle(anchorRect, 452);

  return (
    <div className={S.dropdownBackdropClassName} onClick={dismiss} role='presentation'>
      <Dropdown
        aria-label='카테고리 정렬'
        className={S.dropdownPanelClassName}
        id={SORT_DROPDOWN_ID}
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
  if (!isOpen) {
    return null;
  }

  const dismiss = () => {
    close();
    unmount();
  };
  const positionStyle = getDropdownPositionStyle(anchorRect, 408);

  return (
    <div className={S.dropdownBackdropClassName} onClick={dismiss} role='presentation'>
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
