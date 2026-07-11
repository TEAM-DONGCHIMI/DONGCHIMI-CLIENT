import { type MouseEvent, type ReactNode } from 'react';

import type { RegistrationResultProduct } from '../fixtures';
import {
  getRegistrationResultProductFieldValue,
  type RegistrationResultEditableProductFieldTypes,
  type RegistrationResultProductDraftMapTypes,
} from '../hooks/useRegistrationResultProductDrafts';
import {
  RegistrationResultProductRow,
  type ImagePreview,
  type RegistrationResultProductFieldValues,
} from './RegistrationResultProductRow';
import * as S from './RegistrationResult.css';

interface RegistrationResultTableProps {
  allVisibleSelected: boolean;
  children: ReactNode;
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

const RequiredMark = () => {
  return <span className={S.requiredMarkClassName}>*</span>;
};

const getProductFieldValues = (
  product: RegistrationResultProduct,
  productDrafts: RegistrationResultProductDraftMapTypes,
): RegistrationResultProductFieldValues => {
  return {
    category: getRegistrationResultProductFieldValue(product, productDrafts, 'category'),
    discountPeriod: getRegistrationResultProductFieldValue(
      product,
      productDrafts,
      'discountPeriod',
    ),
    price: getRegistrationResultProductFieldValue(product, productDrafts, 'price'),
    productName: getRegistrationResultProductFieldValue(product, productDrafts, 'productName'),
    promotionText: getRegistrationResultProductFieldValue(product, productDrafts, 'promotionText'),
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
      return <div className={S.emptyStateClassName}>표시할 상품이 없습니다.</div>;
    }

    return products.map((product) => (
      <RegistrationResultProductRow
        checked={selectedIds.has(product.id)}
        fieldValues={getProductFieldValues(product, productDrafts)}
        imagePreview={imagePreviews.get(product.id)}
        key={product.id}
        onCategoryClick={onProductCategoryClick(product)}
        onCheckedChange={(checked) => onRowCheckedChange(product.id, checked)}
        onFieldChange={(field, value) => onProductFieldChange(product.id, field, value)}
        onImageFileChange={onImageFileChange(product.id)}
        product={product}
      />
    ));
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
