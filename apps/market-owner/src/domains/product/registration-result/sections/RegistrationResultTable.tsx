import { useRef, type ChangeEvent, type MouseEvent, type ReactNode } from 'react';

import { ListCell } from '@dongchimi/design-system/components';
import {
  IcChevronDownSizeSmall,
  IcCircleExclamationSizeXsmallColor60,
  IcPlus,
} from '@dongchimi/design-system/icons';

import type { RegistrationResultProduct } from '../fixtures';
import * as S from './RegistrationResultSection.css';

export interface ImagePreview {
  alt: string;
  src: string;
}

interface RegistrationResultTableProps {
  allVisibleSelected: boolean;
  children: ReactNode;
  hasVisibleSelection: boolean;
  imagePreviews: ReadonlyMap<string, ImagePreview>;
  productCategories: ReadonlyMap<string, string>;
  products: readonly RegistrationResultProduct[];
  selectedIds: ReadonlySet<string>;
  segmentLabel: string;
  onImageFileChange: (productId: string) => (file: File) => void;
  onProductCategoryClick: (
    product: RegistrationResultProduct,
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
  onRowCheckedChange: (productId: string, checked: boolean) => void;
  onSelectAll: () => void;
}

const ProductPreview = ({ productName }: { productName: string }) => {
  return (
    <span aria-hidden='true' className={S.productPreviewClassName}>
      {productName.slice(0, 1)}
    </span>
  );
};

const RequiredMark = () => {
  return <span className={S.requiredMarkClassName}>*</span>;
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

const RegistrationProductRow = ({
  category,
  checked,
  imagePreview,
  product,
  onCheckedChange,
  onCategoryClick,
  onImageFileChange,
}: {
  category: string;
  checked: boolean;
  imagePreview?: ImagePreview;
  product: RegistrationResultProduct;
  onCheckedChange: (checked: boolean) => void;
  onCategoryClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onImageFileChange: (file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const needsEdit = product.status === 'needsEdit';
  const productLabel = product.productName || '상품';
  const productImage = imagePreview ?? product.imageUrl;
  let mediaActionLabel: string | undefined;
  let helperText: string | undefined;
  let media: ReactNode = undefined;
  let mediaStatus: 'default' | 'error' = 'default';
  let mediaActionIcon: ReactNode = undefined;
  let helperIcon: ReactNode = undefined;
  let statusLabel = '등록 완료';
  let statusTone: 'negative' | 'neutral' = 'neutral';
  let priceUnit: '원' | undefined;

  if (product.price.length > 0) {
    priceUnit = '원';
  }

  if (needsEdit) {
    helperText = product.statusReason;
    helperIcon = <IcCircleExclamationSizeXsmallColor60 />;
    statusLabel = '수정 필요';
    statusTone = 'negative';
  }

  if (needsEdit && productImage == null) {
    mediaActionLabel = '이미지 추가';
    mediaActionIcon = <IcPlus />;
    mediaStatus = 'error';
  }

  if (productImage == null && !needsEdit) {
    media = <ProductPreview productName={product.productName} />;
  }

  if (productImage != null) {
    let imageAlt = productLabel;
    let imageSrc: string;

    if (typeof productImage === 'string') {
      imageSrc = productImage;
    } else {
      imageSrc = productImage.src;
    }

    if (product.imageAlt != null) {
      imageAlt = product.imageAlt;
    }

    if (imagePreview != null) {
      imageAlt = imagePreview.alt;
    }

    media = (
      <button
        aria-label={`${productLabel} 이미지 변경`}
        className={S.uploadedImageButtonClassName}
        onClick={() => fileInputRef.current?.click()}
        type='button'
      >
        <img alt={imageAlt} className={S.uploadedProductImageClassName} src={imageSrc} />
      </button>
    );
  }

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (file != null) {
      onImageFileChange(file);
    }

    event.currentTarget.value = '';
  };

  return (
    <>
      <ListCell
        aria-label={`${productLabel} 등록 결과`}
        checked={checked}
        checkboxLabel={`${productLabel} 선택`}
        className={S.productRowClassName}
        fields={[
          {
            id: `${product.id}-name`,
            placeholder: '제품명을 입력하세요.',
            value: product.productName || undefined,
            width: '16rem',
          },
          {
            id: `${product.id}-price`,
            inputMode: 'numeric',
            placeholder: '가격을 입력하세요.',
            unit: priceUnit,
            value: product.price || undefined,
            width: '11.2rem',
          },
          {
            'aria-label': `${productLabel} 카테고리 선택`,
            id: `${product.id}-category`,
            onClick: onCategoryClick,
            trailingIcon: <IcChevronDownSizeSmall />,
            value: category,
            width: '12.8rem',
          },
          {
            id: `${product.id}-promotion`,
            placeholder: '홍보문구를 입력하세요.',
            value: product.promotionText || undefined,
            width: '31.9rem',
          },
          {
            id: `${product.id}-discount-period`,
            placeholder: 'YYYY-MM-DD ~  YYYY-MM-DD',
            value: product.discountPeriod || undefined,
            width: '19.8rem',
          },
        ]}
        helperIcon={helperIcon}
        helperText={helperText}
        media={media}
        mediaActionAriaLabel={`${productLabel} 이미지 추가`}
        mediaActionIcon={mediaActionIcon}
        mediaActionLabel={mediaActionLabel}
        mediaStatus={mediaStatus}
        onCheckedChange={onCheckedChange}
        onMediaAction={() => fileInputRef.current?.click()}
        statusLabel={statusLabel}
        statusTone={statusTone}
      />
      <input
        ref={fileInputRef}
        accept='image/*'
        aria-label={`${productLabel} 이미지 파일 선택`}
        className={S.hiddenFileInputClassName}
        onChange={handleImageInputChange}
        type='file'
      />
    </>
  );
};

export const RegistrationResultTable = ({
  allVisibleSelected,
  children,
  hasVisibleSelection,
  imagePreviews,
  productCategories,
  products,
  selectedIds,
  segmentLabel,
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
      <RegistrationProductRow
        category={productCategories.get(product.id) ?? product.category}
        checked={selectedIds.has(product.id)}
        imagePreview={imagePreviews.get(product.id)}
        key={product.id}
        onCategoryClick={onProductCategoryClick(product)}
        onCheckedChange={(checked) => onRowCheckedChange(product.id, checked)}
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
