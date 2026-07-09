import { Dropdown } from '@dongchimi/design-system/components';

import {
  productEditCategoryOptions,
  type ProductEditCategoryTypes,
} from './ProductEditPageShell.constants';
import * as S from './ProductEditPageShell.css';

interface ProductEditCategoryDropdownProps {
  selectedCategory: ProductEditCategoryTypes;
  onSelect: (category: ProductEditCategoryTypes) => void;
}

export const ProductEditCategoryDropdown = ({
  selectedCategory,
  onSelect,
}: ProductEditCategoryDropdownProps) => {
  return (
    <Dropdown aria-label='카테고리 선택' className={S.dropdownMenuClassName} role='group'>
      {productEditCategoryOptions.map((category) => (
        <Dropdown.Item
          key={category}
          color='primary'
          onClick={() => onSelect(category)}
          selected={category === selectedCategory}
        >
          {category}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};
