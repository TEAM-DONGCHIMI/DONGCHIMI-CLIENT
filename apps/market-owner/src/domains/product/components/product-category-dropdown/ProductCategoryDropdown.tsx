import { Dropdown } from '@dongchimi/design-system/components';

interface ProductCategoryDropdownProps<CategoryTypes extends string> {
  ariaLabel: string;
  options: readonly CategoryTypes[];
  selectedCategory: CategoryTypes | null;
  onSelect: (category: CategoryTypes) => void;
  className?: string;
  id?: string;
  isSelected?: (category: CategoryTypes) => boolean;
  itemClassName?: string;
}

export const ProductCategoryDropdown = <CategoryTypes extends string>({
  ariaLabel,
  className,
  id,
  isSelected,
  itemClassName,
  onSelect,
  options,
  selectedCategory,
}: ProductCategoryDropdownProps<CategoryTypes>) => {
  return (
    <Dropdown aria-label={ariaLabel} className={className} id={id} role='group'>
      {options.map((category) => (
        <Dropdown.Item
          className={itemClassName}
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
