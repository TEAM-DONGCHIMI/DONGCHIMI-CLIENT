import type { CSSProperties } from 'react';

import { Dropdown } from '@dongchimi/design-system/components';

import { formatProductCategoryDisplayName } from '@/shared/utils/product-category.utils';

import * as S from './ProductCategoryDropdown.css';

interface ProductCategoryDropdownProps<CategoryTypes extends string> {
  ariaLabel: string;
  options: readonly CategoryTypes[];
  selectedCategory: CategoryTypes | null;
  onSelect: (category: CategoryTypes) => void;
  className?: string;
  id?: string;
  isSelected?: (category: CategoryTypes) => boolean;
  style?: CSSProperties;
}

export const ProductCategoryDropdown = <CategoryTypes extends string>({
  ariaLabel,
  className,
  id,
  isSelected,
  onSelect,
  options,
  selectedCategory,
  style,
}: ProductCategoryDropdownProps<CategoryTypes>) => {
  const dropdownStyle: CSSProperties = {
    ...style,
    maxHeight: 'var(--product-category-dropdown-max-height)',
    overflowX: 'hidden',
    overflowY: 'auto',
    overscrollBehaviorY: 'none',
  };

  return (
    <Dropdown
      aria-label={ariaLabel}
      className={className}
      id={id}
      role='group'
      style={dropdownStyle}
    >
      {options.map((category) => (
        <Dropdown.Item
          className={S.itemClassName}
          color='primary'
          key={category}
          onClick={() => onSelect(category)}
          selected={isSelected?.(category) ?? category === selectedCategory}
        >
          {formatProductCategoryDisplayName(category)}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};
