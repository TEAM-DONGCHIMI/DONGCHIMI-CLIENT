import type { CSSProperties } from 'react';

import { Dropdown } from '@dongchimi/design-system/components';

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
  return (
    <Dropdown aria-label={ariaLabel} className={className} id={id} role='group' style={style}>
      {options.map((category) => (
        <Dropdown.Item
          className={S.itemClassName}
          color='primary'
          key={category}
          onClick={() => onSelect(category)}
          selected={isSelected?.(category) ?? category === selectedCategory}
        >
          {category}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};
