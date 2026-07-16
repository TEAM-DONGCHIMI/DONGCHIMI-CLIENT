import { useLayoutEffect, useRef, type CSSProperties } from 'react';

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
  renderInTopLayer?: boolean;
  style?: CSSProperties;
}

export const ProductCategoryDropdown = <CategoryTypes extends string>({
  ariaLabel,
  className,
  id,
  isSelected,
  onSelect,
  options,
  renderInTopLayer = false,
  selectedCategory,
  style,
}: ProductCategoryDropdownProps<CategoryTypes>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const canRenderInTopLayer =
    renderInTopLayer &&
    typeof HTMLElement !== 'undefined' &&
    'showPopover' in HTMLElement.prototype;
  const dropdownStyle: CSSProperties = {
    ...style,
    maxHeight: 'var(--product-category-dropdown-max-height)',
    overflowX: 'hidden',
    overflowY: 'auto',
    overscrollBehaviorY: 'none',
  };

  useLayoutEffect(() => {
    if (!canRenderInTopLayer) {
      return;
    }

    dropdownRef.current?.showPopover?.();
  }, [canRenderInTopLayer]);

  return (
    <Dropdown
      ref={dropdownRef}
      aria-label={ariaLabel}
      className={className}
      id={id}
      popover={canRenderInTopLayer ? 'manual' : undefined}
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
