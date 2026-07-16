import { type MouseEvent, type ReactNode } from 'react';

import { getProductCategoryGroup } from '@/shared/utils/product-category.utils';

import type {
  RegistrationResultEditableProductFieldTypes,
  RegistrationResultProduct,
  RegistrationResultProductDraftMapTypes,
  RegistrationResultProductFieldValues,
} from '../model';
import { getRegistrationResultProductFieldValues } from '../model';
import {
  validateRegistrationResultProductFields,
  type RegistrationResultProductFieldErrorTypes,
} from '../utils/registration-result-product-validation';
import { RegistrationResultProductRow, type ImagePreview } from './RegistrationResultProductRow';
import * as S from './RegistrationResult.css';

interface RegistrationResultTableProps {
  allVisibleSelected: boolean;
  children: ReactNode;
  emptyMessage?: string;
  hasVisibleSelection: boolean;
  imagePreviews: ReadonlyMap<string, ImagePreview>;
  productDrafts: RegistrationResultProductDraftMapTypes;
  products: readonly RegistrationResultProduct[];
  selectedIds: ReadonlySet<string>;
  segmentLabel: string;
  onProductFieldChange: (
    productId: string,
    field: RegistrationResultEditableProductFieldTypes,
    value: string,
  ) => void;
  onImageFileChange: (productId: string) => (file: File) => void;
  onProductCategoryClick: (
    product: RegistrationResultProduct,
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
  onRowCheckedChange: (productId: string, checked: boolean) => void;
  onSelectAll: () => void;
}

const EMPTY_PRODUCT_ROW_COUNT = 4;

const RequiredMark = () => {
  return <span className={S.requiredMarkClassName}>*</span>;
};

const getVisibleFieldErrors = (
  fieldErrors: RegistrationResultProductFieldErrorTypes,
  hasLocalChanges: boolean,
) => {
  return hasLocalChanges ? fieldErrors : {};
};

const getProductFieldValues = (
  product: RegistrationResultProduct,
  productDrafts: RegistrationResultProductDraftMapTypes,
): RegistrationResultProductFieldValues => {
  const fieldValues = getRegistrationResultProductFieldValues(product, productDrafts);

  return {
    ...fieldValues,
    category:
      fieldValues.category.trim().length > 0 ? getProductCategoryGroup(fieldValues.category) : '',
  };
};

const HeaderSelectionButton = ({
  checked,
  mixed,
  onClick,
}: {
  checked: boolean;
  mixed: boolean;
  onClick: () => void;
}) => {
  let ariaChecked: boolean | 'mixed' = checked;
  let selectionState: 'checked' | 'mixed' | 'unchecked' = 'unchecked';
  let mixedMark = null;

  if (mixed) {
    ariaChecked = 'mixed';
    selectionState = 'mixed';
    mixedMark = <span className={S.selectionMixedMarkClassName} />;
  } else if (checked) {
    selectionState = 'checked';
  }

  return (
    <button
      aria-checked={ariaChecked}
      aria-label='현재 페이지 상품 전체 선택'
      className={S.headerSelectionButtonClassName}
      onClick={onClick}
      role='checkbox'
      type='button'
    >
      <span className={S.selectionBoxRecipe({ state: selectionState })}>{mixedMark}</span>
    </button>
  );
};

const TableHeader = ({
  allVisibleSelected,
  hasVisibleSelection,
  onSelectAll,
}: {
  allVisibleSelected: boolean;
  hasVisibleSelection: boolean;
  onSelectAll: () => void;
}) => {
  return (
    <div className={S.tableHeaderClassName}>
      <div className={S.headerCellClassName}>
        <HeaderSelectionButton
          checked={allVisibleSelected}
          mixed={hasVisibleSelection && !allVisibleSelected}
          onClick={onSelectAll}
        />
      </div>
      <div className={S.headerCellClassName}>
        <span>상품 이미지</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>
        <span>상품명</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>
        <span>판매가격</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>
        <span>카테고리</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>홍보문구</div>
      <div className={S.headerCellClassName}>
        <span>할인 기간</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>상태</div>
    </div>
  );
};

export const RegistrationResultTable = ({
  allVisibleSelected,
  children,
  emptyMessage,
  hasVisibleSelection,
  imagePreviews,
  productDrafts,
  products,
  selectedIds,
  segmentLabel,
  onProductFieldChange,
  onImageFileChange,
  onProductCategoryClick,
  onRowCheckedChange,
  onSelectAll,
}: RegistrationResultTableProps) => {
  const renderProductRows = () => {
    if (products.length === 0) {
      if (emptyMessage != null) {
        return <div className={S.emptyStateClassName}>{emptyMessage}</div>;
      }

      return Array.from({ length: EMPTY_PRODUCT_ROW_COUNT }, (_, index) => (
        <div
          aria-hidden='true'
          className={S.emptyProductRowClassName}
          key={`empty-product-row-${index}`}
        />
      ));
    }

    return products.map((product) => {
      const fieldValues = getProductFieldValues(product, productDrafts);
      const fieldErrors = getVisibleFieldErrors(
        validateRegistrationResultProductFields(fieldValues),
        productDrafts.has(product.id) || imagePreviews.has(product.id),
      );

      return (
        <RegistrationResultProductRow
          checked={selectedIds.has(product.id)}
          fieldErrors={fieldErrors}
          fieldValues={fieldValues}
          imagePreview={imagePreviews.get(product.id)}
          key={product.id}
          onCategoryClick={onProductCategoryClick(product)}
          onCheckedChange={(checked) => onRowCheckedChange(product.id, checked)}
          onFieldChange={(field, value) => onProductFieldChange(product.id, field, value)}
          onImageFileChange={onImageFileChange(product.id)}
          product={product}
        />
      );
    });
  };

  return (
    <div className={S.tableScrollClassName}>
      <div className={S.tableClassName}>
        <TableHeader
          allVisibleSelected={allVisibleSelected}
          hasVisibleSelection={hasVisibleSelection}
          onSelectAll={onSelectAll}
        />

        <div aria-label={`${segmentLabel} 상품 목록`} className={S.listClassName}>
          {renderProductRows()}
        </div>

        {children}
      </div>
    </div>
  );
};
