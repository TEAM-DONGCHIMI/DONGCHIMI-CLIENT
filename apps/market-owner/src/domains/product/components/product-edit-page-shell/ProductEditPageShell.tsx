import { type ReactNode } from 'react';
import { Link } from 'react-router';

import { Button, PillButton, TabNav } from '@dongchimi/design-system/components';
import {
  IcCalendarSizeXsmallColorPrimary,
  IcChevronDownSizeSmallColor50,
  IcChevronUpSizeSmallColor50,
  IcResetSizeSmallColorNegative,
  IcTrashSizeSmallColorNegative,
} from '@dongchimi/design-system/icons';

import { DesktopHeader } from '@/shared/components';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { type ProductCategoryTypes } from '../../constants';

import {
  editPageCopyByType,
  productEditSortOptions,
  type ProductEditFilterTypes,
  type ProductEditTypeTypes,
} from './ProductEditPageShell.constants';
import * as S from './ProductEditPageShell.css';
import { ProductEditCategoryDropdown } from './ProductEditCategoryDropdown';
import { useProductEditFilter } from './hooks';

export interface ProductEditPageShellProps {
  activeType: ProductEditTypeTypes;
  children:
    | ReactNode
    | ((
        selectedFilter: ProductEditFilterTypes,
        selectedCategory: ProductCategoryTypes | null,
      ) => ReactNode);
}
export const ProductEditPageShell = ({ activeType, children }: ProductEditPageShellProps) => {
  const pageCopy = editPageCopyByType[activeType];
  const {
    categoryFilterRef,
    isCategoryDropdownOpen,
    isCategorySelected,
    selectedCategory,
    selectedFilter,
    showCategoryFilter,
    openCategoryDropdown,
    selectCategoryFilter,
    selectSortFilter,
  } = useProductEditFilter({ activeType });

  return (
    <main className={S.pageClassName}>
      <div className={S.scrollFixedHeaderClassName}>
        <DesktopHeader currentLabel={pageCopy.currentLabel} parentLabel='홈' />

        <div className={S.controlClassName}>
          <div className={S.headingBlockClassName}>
            <h1 className={S.headingClassName}>{pageCopy.heading}</h1>
            <p className={S.descriptionClassName}>등록한 상품을 수정할 수 있어요.</p>
          </div>

          <div className={S.tabsAndActionsClassName}>
            <TabNav aria-label='상품 수정 유형'>
              <TabNav.List>
                <TabNav.Item
                  as={Link}
                  selected={activeType === 'todaySpecial'}
                  to={MARKET_OWNER_ROUTES.todaySpecialEdit}
                >
                  오늘의 특가
                </TabNav.Item>
                <TabNav.Item
                  as={Link}
                  selected={activeType === 'eventDiscount'}
                  to={MARKET_OWNER_ROUTES.eventDiscountEdit}
                >
                  행사 할인
                </TabNav.Item>
              </TabNav.List>
            </TabNav>

            <div aria-label='상품 관리 작업' className={S.actionGroupClassName} role='group'>
              <Button
                className={S.actionButtonClassNames.primary}
                color='primary'
                leftIcon={<IcCalendarSizeXsmallColorPrimary aria-hidden='true' />}
                size='xsmall'
                variant='soft'
              >
                기간 일괄 수정
              </Button>
              <Button
                className={S.actionButtonClassNames.negative}
                color='negative'
                leftIcon={<IcTrashSizeSmallColorNegative aria-hidden='true' />}
                size='xsmall'
                variant='outlined'
              >
                일괄 삭제
              </Button>
              <Button
                className={S.actionButtonClassNames.reset}
                color='negative'
                leftIcon={<IcResetSizeSmallColorNegative aria-hidden='true' />}
                size='xsmall'
                variant='outlined'
              >
                초기화
              </Button>
            </div>
          </div>

          <div className={S.filterRowClassName}>
            {showCategoryFilter && (
              <div ref={categoryFilterRef} className={S.categoryFilterClassName}>
                <PillButton
                  aria-expanded={isCategoryDropdownOpen}
                  aria-pressed={isCategorySelected}
                  icon={
                    isCategoryDropdownOpen ? (
                      <IcChevronUpSizeSmallColor50 />
                    ) : (
                      <IcChevronDownSizeSmallColor50 />
                    )
                  }
                  platform='desktop'
                  variant={isCategorySelected ? 'filled' : 'outlined-light'}
                  onClick={openCategoryDropdown}
                >
                  {selectedCategory ?? '카테고리별'}
                </PillButton>

                {isCategoryDropdownOpen && (
                  <ProductEditCategoryDropdown
                    selectedCategory={selectedCategory}
                    onSelect={selectCategoryFilter}
                  />
                )}
              </div>
            )}
            {productEditSortOptions.map(({ label, value }) => {
              const isSelected = selectedFilter === value;

              return (
                <PillButton
                  key={value}
                  aria-pressed={isSelected}
                  platform='desktop'
                  variant={isSelected ? 'filled' : 'outlined-light'}
                  onClick={() => selectSortFilter(value)}
                >
                  {label}
                </PillButton>
              );
            })}
          </div>
        </div>
      </div>

      <div className={S.contentClassName}>
        {typeof children === 'function' ? children(selectedFilter, selectedCategory) : children}
      </div>
    </main>
  );
};
