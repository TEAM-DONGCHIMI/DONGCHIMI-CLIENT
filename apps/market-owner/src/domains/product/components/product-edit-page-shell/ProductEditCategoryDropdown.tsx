import type { CSSProperties } from 'react';

import { productCategoryOptions, type ProductCategoryTypes } from '../../constants';
import { ProductCategoryDropdown } from '../product-category-dropdown';
import * as S from './ProductEditPageShell.css';

interface ProductEditCategoryDropdownProps {
  selectedCategory: ProductCategoryTypes | null;
  style?: CSSProperties;
  onSelect: (category: ProductCategoryTypes) => void;
}

export const ProductEditCategoryDropdown = ({
  selectedCategory,
  style,
  onSelect,
}: ProductEditCategoryDropdownProps) => {
  return (
    <ProductCategoryDropdown
      ariaLabel='카테고리 선택'
      className={S.dropdownMenuClassName}
      isSelected={(category) =>
        category === selectedCategory || (category === '전체' && selectedCategory == null)
      }
      options={productCategoryOptions}
      selectedCategory={selectedCategory}
      style={style}
      onSelect={onSelect}
    />
  );
};
