import { type ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Button, PillButton, TabNav } from '@dongchimi/design-system/components';
import {
  IcCalendarSizeXsmallColorPrimaryStrong,
  IcCalendarSizeXsmallColorPrimary,
  IcChevronDownSizeSmallColor50,
  IcChevronUpSizeSmallColor50,
  IcResetSizeSmallColorNegative,
  IcTrashSizeSmallColorNegativeStrong,
  IcTrashSizeSmallColorNegative,
} from '@dongchimi/design-system/icons';

import {
  DesktopHeader,
  ProductHeaderSearch,
  type ProductHeaderSearchProductTypes,
} from '@/shared/components';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';
import { createProductEditTargetPath } from '@/shared/utils/product-edit-target-path.utils';
import { type ProductCategoryTypes } from '../../constants';
import { useProductSearchQuery } from '../../hooks';
import { type ProductEditCardProps } from '../product-edit-product-list';

import {
  editPageCopyByType,
  productEditSortOptions,
  type ProductEditFilterTypes,
  type ProductEditTypeTypes,
} from './ProductEditPageShell.constants';
import * as S from './ProductEditPageShell.css';
import { ProductEditCategoryDropdown } from './ProductEditCategoryDropdown';
import {
  type ProductEditPageSelectionControls,
  useProductEditBulkSelection,
  useProductEditFilter,
} from './hooks';

const PRODUCT_SEARCH_RESULT_SIZE = 10;

export interface ProductEditPageShellProps {
  activeType: ProductEditTypeTypes;
  children:
    | ReactNode
    | ((
        selectedFilter: ProductEditFilterTypes,
        selectedCategory: ProductCategoryTypes | null,
        selection: ProductEditPageSelectionControls,
      ) => ReactNode);
  deletePending?: boolean;
  onDeleteProducts?: (productIds: number[]) => Promise<boolean>;
  onResetProducts?: () => Promise<boolean>;
  onUpdateProductPeriods?: (
    productNames: string[],
    period: { endDate: string; startDate: string },
  ) => void;
  periodBaseProduct?: ProductEditCardProps;
  productCounts?: Partial<Record<ProductEditTypeTypes, number>>;
}

export const ProductEditPageShell = ({
  activeType,
  children,
  deletePending = false,
  onDeleteProducts,
  onResetProducts,
  onUpdateProductPeriods,
  periodBaseProduct,
  productCounts,
}: ProductEditPageShellProps) => {
  const navigate = useNavigate();
  const [productSearchKeyword, setProductSearchKeyword] = useState('');
  const marketId = useAuthStore((state) => state.marketId);
  const productSearchQuery = useProductSearchQuery({
    keyword: productSearchKeyword,
    marketId,
    size: PRODUCT_SEARCH_RESULT_SIZE,
  });
  const productSearchProducts = productSearchQuery.data?.data?.products ?? [];
  const pageCopy = editPageCopyByType[activeType];

  // 필터/드롭다운 상태
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

  // 일괄 작업 상태
  const {
    bulkAction,
    selectedProductCount,
    selectionControls,
    openDeleteBulkAction,
    openPeriodBulkAction,
    openResetConfirm,
  } = useProductEditBulkSelection({
    activeType,
    marketId,
    periodBaseProduct,
    onDeleteProducts,
    onResetProducts,
    onUpdateProductPeriods,
  });
  const isDeleteButtonEmphasized = bulkAction === 'delete' && selectedProductCount > 0;
  const isPeriodButtonEmphasized = bulkAction === 'period' && selectedProductCount > 0;
  const handleSelectHeaderProduct = (product: ProductHeaderSearchProductTypes) => {
    navigate(createProductEditTargetPath(product));
  };
  const periodButtonProps = isPeriodButtonEmphasized
    ? {
        className: S.actionButtonClassNames.primarySolid,
        color: 'primary' as const,
        leftIcon: <IcCalendarSizeXsmallColorPrimaryStrong aria-hidden='true' />,
        variant: 'solid' as const,
      }
    : {
        className: S.actionButtonClassNames.primary,
        color: 'primary' as const,
        leftIcon: <IcCalendarSizeXsmallColorPrimary aria-hidden='true' />,
        variant: 'soft' as const,
      };

  const renderEditTypeTab = ({
    children: tabLabel,
    type,
    to,
  }: {
    children: string;
    type: ProductEditTypeTypes;
    to: string;
  }) => {
    const isSelected = activeType === type;
    const isDisabled = productCounts?.[type] === 0;

    if (isDisabled) {
      return (
        <TabNav.Item disabled selected={isSelected}>
          {tabLabel}
        </TabNav.Item>
      );
    }

    return (
      <TabNav.Item as={Link} selected={isSelected} to={to}>
        {tabLabel}
      </TabNav.Item>
    );
  };

  return (
    <main className={S.pageClassName}>
      <div className={S.scrollFixedHeaderClassName}>
        <DesktopHeader
          currentLabel={pageCopy.currentLabel}
          parentLabel='홈'
          searchSlot={
            <ProductHeaderSearch
              isPending={productSearchQuery.isFetching}
              onQueryChange={setProductSearchKeyword}
              onSelectProduct={handleSelectHeaderProduct}
              products={productSearchProducts}
              status={productSearchQuery.isError ? 'error' : 'default'}
            />
          }
        />

        <div className={S.controlClassName}>
          <div className={S.headingBlockClassName}>
            <h1 className={S.headingClassName}>{pageCopy.heading}</h1>
            <p className={S.descriptionClassName}>등록한 상품을 수정할 수 있어요.</p>
          </div>

          <div className={S.tabsAndActionsClassName}>
            <TabNav aria-label='상품 수정 유형'>
              <TabNav.List>
                {renderEditTypeTab({
                  children: '오늘의 특가',
                  type: 'todaySpecial',
                  to: MARKET_OWNER_ROUTES.todaySpecialEdit,
                })}
                {renderEditTypeTab({
                  children: '행사 할인',
                  type: 'eventDiscount',
                  to: MARKET_OWNER_ROUTES.eventDiscountEdit,
                })}
              </TabNav.List>
            </TabNav>

            <div aria-label='상품 관리 작업' className={S.actionGroupClassName} role='group'>
              {selectedProductCount > 0 && (
                <span
                  aria-label={`선택된 상품 (${selectedProductCount})`}
                  className={S.selectedProductCountClassName}
                >
                  선택된 상품 (
                  <span className={S.selectedProductNumberClassName}>{selectedProductCount}</span>)
                </span>
              )}
              <Button
                {...periodButtonProps}
                disabled={deletePending}
                size='xsmall'
                onClick={openPeriodBulkAction}
              >
                기간 일괄 수정
              </Button>
              <Button
                className={
                  isDeleteButtonEmphasized
                    ? S.actionButtonClassNames.negativeSolid
                    : S.actionButtonClassNames.negative
                }
                color='negative'
                disabled={deletePending}
                leftIcon={
                  isDeleteButtonEmphasized ? (
                    <IcTrashSizeSmallColorNegativeStrong aria-hidden='true' />
                  ) : (
                    <IcTrashSizeSmallColorNegative aria-hidden='true' />
                  )
                }
                size='xsmall'
                variant={isDeleteButtonEmphasized ? 'solid' : 'outlined'}
                onClick={openDeleteBulkAction}
              >
                일괄 삭제
              </Button>
              <Button
                className={S.actionButtonClassNames.reset}
                color='negative'
                disabled={deletePending}
                leftIcon={<IcResetSizeSmallColorNegative aria-hidden='true' />}
                size='xsmall'
                variant='outlined'
                onClick={openResetConfirm}
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
        {typeof children === 'function'
          ? children(selectedFilter, selectedCategory, selectionControls)
          : children}
      </div>
    </main>
  );
};
