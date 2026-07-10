import type { CSSProperties } from 'react';

import { productSelectableCategoryOptions } from '../../constants';
import { ProductCategoryDropdown } from '../../components/product-category-dropdown';
import * as S from '../TodaySpecialRegistrationPage.css';

interface CategoryDropdownOverlayProps {
  id: string;
  onClose: () => void;
  onSelect: (category: string) => void;
  selectedCategory: string;
  style: CSSProperties;
}

export const CategoryDropdownOverlay = ({
  id,
  onClose,
  onSelect,
  selectedCategory,
  style,
}: CategoryDropdownOverlayProps) => {
  return (
    <div
      className={S.categoryDropdownOverlayClassName}
      data-today-special-category-overlay
      style={style}
    >
      <ProductCategoryDropdown
        ariaLabel='상품 구분 선택'
        className={S.categoryDropdownClassName}
        id={id}
        itemClassName={S.categoryDropdownItemClassName}
        options={productSelectableCategoryOptions}
        selectedCategory={selectedCategory}
        onSelect={(category) => {
          onSelect(category);
          onClose();
        }}
      />
    </div>
  );
};
