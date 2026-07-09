import type { CSSProperties } from 'react';

import { Dropdown } from '@dongchimi/design-system/components';

import { todaySpecialCategoryOptions } from '../fixtures';
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
      <Dropdown className={S.categoryDropdownClassName} id={id}>
        {todaySpecialCategoryOptions.map((category) => (
          <Dropdown.Item
            checkbox={false}
            className={S.categoryDropdownItemClassName}
            color='primary'
            key={category}
            onClick={() => {
              onSelect(category);
              onClose();
            }}
            selected={category === selectedCategory}
          >
            {category}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};
