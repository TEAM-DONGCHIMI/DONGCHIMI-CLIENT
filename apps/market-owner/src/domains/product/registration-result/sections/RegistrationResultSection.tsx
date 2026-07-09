import { useMemo, useState } from 'react';

import { ListCell } from '@dongchimi/design-system/components';
import {
  IcChevronDownSizeSmall,
  IcCircleExclamationFillSizeXsmallColorNegative,
  IcCircleExclamationSizeXsmallColor60,
  IcPlus,
} from '@dongchimi/design-system/icons';

import {
  DesktopUploadHeader,
  PaginationFooter,
  type UploadSegmentTypes,
} from '@/shared/components';

import type { RegistrationResultProduct } from '../fixtures';
import * as S from './RegistrationResultSection.css';

interface RegistrationResultSummary {
  completedCount: number;
  needsEditCount: number;
  totalCount: number;
}

export interface RegistrationResultSectionProps {
  pageSize: number;
  products: readonly RegistrationResultProduct[];
  summary: RegistrationResultSummary;
  onPrevious: () => void;
  onRegister: () => void;
}

const SEGMENT_LABELS: Record<UploadSegmentTypes, string> = {
  completed: '등록 완료',
  needsEdit: '수정 필요',
  total: '총 상품',
};

const getProductMatchesSearch = (product: RegistrationResultProduct, searchValue: string) => {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  if (normalizedSearchValue.length === 0) {
    return true;
  }

  return [product.productName, product.category, product.promotionText].some((value) =>
    value.toLowerCase().includes(normalizedSearchValue),
  );
};

const getProductMatchesSegment = (
  product: RegistrationResultProduct,
  selectedSegment: UploadSegmentTypes,
) => {
  if (selectedSegment === 'total') {
    return true;
  }

  if (selectedSegment === 'completed') {
    return product.status === 'completed';
  }

  return product.status === 'needsEdit';
};

const getVisibleTotalCount = ({
  completedCount,
  needsEditCount,
  selectedSegment,
  totalCount,
}: RegistrationResultSummary & { selectedSegment: UploadSegmentTypes }) => {
  if (selectedSegment === 'completed') {
    return completedCount;
  }

  if (selectedSegment === 'needsEdit') {
    return needsEditCount;
  }

  return totalCount;
};

const getPaginationPages = (totalCount: number, pageSize: number) => {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  return Array.from({ length: Math.min(pageCount, 2) }, (_, index) => index + 1);
};

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
  const ariaChecked = mixed ? 'mixed' : checked;

  return (
    <button
      aria-checked={ariaChecked}
      aria-label='현재 페이지 상품 전체 선택'
      className={S.headerSelectionButtonClassName}
      onClick={onClick}
      role='checkbox'
      type='button'
    >
      <span className={S.selectionBoxRecipe({ checked: checked || mixed })} />
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
  checked,
  product,
  onCheckedChange,
}: {
  checked: boolean;
  product: RegistrationResultProduct;
  onCheckedChange: (checked: boolean) => void;
}) => {
  const needsEdit = product.status === 'needsEdit';
  const productLabel = product.productName || '상품';
  const mediaActionLabel = needsEdit ? '이미지 추가' : undefined;
  const media = needsEdit ? undefined : <ProductPreview productName={product.productName} />;
  const helperText = needsEdit ? product.statusReason : undefined;

  return (
    <ListCell
      aria-label={`${productLabel} 등록 결과`}
      checked={checked}
      checkboxLabel={`${productLabel} 선택`}
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
          unit: product.price.length > 0 ? '원' : undefined,
          value: product.price || undefined,
          width: '11.2rem',
        },
        {
          'aria-label': `${productLabel} 카테고리 선택`,
          id: `${product.id}-category`,
          onClick: () => undefined,
          trailingIcon: <IcChevronDownSizeSmall />,
          value: product.category,
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
      helperIcon={needsEdit ? <IcCircleExclamationSizeXsmallColor60 /> : undefined}
      helperText={helperText}
      media={media}
      mediaActionAriaLabel={`${productLabel} 이미지 추가`}
      mediaActionIcon={needsEdit ? <IcPlus /> : undefined}
      mediaActionLabel={mediaActionLabel}
      mediaStatus={needsEdit ? 'error' : 'default'}
      onCheckedChange={onCheckedChange}
      statusLabel={needsEdit ? '수정 필요' : '등록 완료'}
      statusTone={needsEdit ? 'negative' : 'neutral'}
    />
  );
};

export const RegistrationResultSection = ({
  pageSize,
  products,
  summary,
  onPrevious,
  onRegister,
}: RegistrationResultSectionProps) => {
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(new Set());
  const [searchValue, setSearchValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedSegment, setSelectedSegment] = useState<UploadSegmentTypes>('needsEdit');
  const currentProducts = useMemo(() => {
    return products.filter((product) => !removedIds.has(product.id));
  }, [products, removedIds]);
  const completedSampleCount = products.filter((product) => product.status === 'completed').length;
  const currentCompletedSampleCount = currentProducts.filter(
    (product) => product.status === 'completed',
  ).length;
  const removedCompletedCount = completedSampleCount - currentCompletedSampleCount;
  const needsEditCount = currentProducts.filter((product) => product.status === 'needsEdit').length;
  const completedCount = Math.max(0, summary.completedCount - removedCompletedCount);
  const removedCount = products.length - currentProducts.length;
  const totalCount = Math.max(0, summary.totalCount - removedCount);
  const currentSummary = { completedCount, needsEditCount, totalCount };
  const visibleTotalCount = getVisibleTotalCount({ ...currentSummary, selectedSegment });
  const registerDisabled = needsEditCount > 0;

  const filteredProducts = useMemo(() => {
    return currentProducts.filter(
      (product) =>
        getProductMatchesSegment(product, selectedSegment) &&
        getProductMatchesSearch(product, searchValue),
    );
  }, [currentProducts, searchValue, selectedSegment]);

  const pageProducts = filteredProducts.slice(0, pageSize);
  const selectedCount = pageProducts.filter((product) => selectedIds.has(product.id)).length;
  const allVisibleSelected = pageProducts.length > 0 && selectedCount === pageProducts.length;
  const hasVisibleSelection = selectedCount > 0;
  const footerTotalCount =
    searchValue.trim().length > 0 ? filteredProducts.length : visibleTotalCount;
  const rangeStart = footerTotalCount > 0 ? 1 : 0;
  const rangeEnd = Math.min(pageSize, footerTotalCount);
  const pages = getPaginationPages(footerTotalCount, pageSize);

  const handleSegmentChange = (nextSegment: UploadSegmentTypes) => {
    setSelectedSegment(nextSegment);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    setRemovedIds((previousRemovedIds) => {
      const nextRemovedIds = new Set(previousRemovedIds);

      selectedIds.forEach((productId) => nextRemovedIds.add(productId));

      return nextRemovedIds;
    });
    setSelectedIds(new Set());
  };

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((previousSelectedIds) => {
        const nextSelectedIds = new Set(previousSelectedIds);

        pageProducts.forEach((product) => nextSelectedIds.delete(product.id));

        return nextSelectedIds;
      });

      return;
    }

    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);

      pageProducts.forEach((product) => nextSelectedIds.add(product.id));

      return nextSelectedIds;
    });
  };

  const handleRowCheckedChange = (productId: string, checked: boolean) => {
    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);

      if (checked) {
        nextSelectedIds.add(productId);
      } else {
        nextSelectedIds.delete(productId);
      }

      return nextSelectedIds;
    });
  };

  return (
    <section aria-labelledby='registration-result-title' className={S.sectionClassName}>
      <div className={S.headingContainerClassName}>
        <h1 className={S.titleClassName} id='registration-result-title'>
          상품 결과 등록 확인
        </h1>
        <p className={S.descriptionClassName}>
          AI가 상품 정보를 분석했습니다. 등록 전 내용을 확인해주세요. (
          <span className={S.requiredMarkClassName}>*</span>) 표시는 필수 입력 사항입니다.
        </p>
      </div>

      <div className={S.tableContainerClassName}>
        <DesktopUploadHeader
          completedCount={completedCount}
          needsEditCount={needsEditCount}
          onDeleteSelected={handleDeleteSelected}
          onSearch={setSearchValue}
          onSearchValueChange={setSearchValue}
          onSegmentChange={handleSegmentChange}
          searchValue={searchValue}
          selectedCount={selectedCount}
          selectedSegment={selectedSegment}
          totalCount={totalCount}
        />

        <div className={S.tableScrollClassName}>
          <div className={S.tableClassName}>
            <TableHeader
              allVisibleSelected={allVisibleSelected}
              hasVisibleSelection={hasVisibleSelection}
              onSelectAll={handleSelectAll}
            />

            <div
              aria-label={`${SEGMENT_LABELS[selectedSegment]} 상품 목록`}
              className={S.listClassName}
            >
              {pageProducts.length > 0 ? (
                pageProducts.map((product) => (
                  <RegistrationProductRow
                    checked={selectedIds.has(product.id)}
                    key={product.id}
                    onCheckedChange={(checked) => handleRowCheckedChange(product.id, checked)}
                    product={product}
                  />
                ))
              ) : (
                <div className={S.emptyStateClassName}>표시할 상품이 없습니다.</div>
              )}
            </div>

            <PaginationFooter
              currentPage={1}
              nextDisabled={pages.length <= 1}
              pages={pages}
              previousDisabled
              rangeEnd={rangeEnd}
              rangeStart={rangeStart}
              totalCount={footerTotalCount}
            />
          </div>
        </div>
      </div>

      <div className={S.bottomBarClassName}>
        <p aria-live='polite' className={S.statusNoticeRecipe({ visible: registerDisabled })}>
          <IcCircleExclamationFillSizeXsmallColorNegative aria-hidden='true' />
          <span>확인이 필요한 상품이 있어요 ({needsEditCount})</span>
        </p>

        <div className={S.actionGroupClassName}>
          <button className={S.previousButtonClassName} onClick={onPrevious} type='button'>
            이전
          </button>
          <button
            className={S.registerButtonClassName}
            disabled={registerDisabled}
            onClick={onRegister}
            type='button'
          >
            등록 완료
          </button>
        </div>
      </div>
    </section>
  );
};
