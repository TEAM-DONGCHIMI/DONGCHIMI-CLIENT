import { type ComponentPropsWithoutRef, type MouseEventHandler, type ReactNode } from 'react';

import { IcTrash, IcWrite } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import { formatProductCategoryDisplayName } from '@/shared/utils/product-category.utils';

import * as S from './ProductEditCardDesktop.css';

type NativeArticleProps = Omit<ComponentPropsWithoutRef<'article'>, 'children' | 'onClick'>;

export type ProductEditCardDesktopSelectionStateTypes = 'default' | 'selectable' | 'selected';

export interface ProductEditCardDesktopProps extends NativeArticleProps {
  actionsDisabled?: boolean;
  categoryName?: string;
  deleteLabel?: string;
  editLabel?: string;
  endDate?: string;
  originalPrice?: string;
  periodDiscountDate?: boolean;
  priceUnit?: string;
  productId?: number | string;
  productName: string;
  salePercent?: string;
  salePercentUnit?: string;
  salePrice: string;
  selectLabel?: string;
  selectionState?: ProductEditCardDesktopSelectionStateTypes;
  startDate?: string;
  todayDiscountPrice?: boolean;
  viewCount?: number | string;
  viewCountLabel?: string;
  onDeleteClick?: MouseEventHandler<HTMLButtonElement>;
  onEditClick?: MouseEventHandler<HTMLButtonElement>;
  onSelectClick?: MouseEventHandler<HTMLButtonElement>;
}

const DEFAULT_CATEGORY_NAME = '정육';
const DEFAULT_VIEW_COUNT_LABEL = '조회';
const DEFAULT_PRICE_UNIT = '원';
const DEFAULT_SALE_PERCENT_UNIT = '%';
const DEFAULT_EDIT_LABEL = '상품 수정';
const DEFAULT_DELETE_LABEL = '상품 삭제';
const DEFAULT_SELECT_LABEL = '상품 선택';
const THOUSAND_VIEW_COUNT = 1_000;
const TEN_THOUSAND_VIEW_COUNT = 10_000;

const formatDisplayDate = (date: string) => {
  const match = date.match(/(\d{4})[.-]\s*(\d{1,2})[.-]\s*(\d{1,2})/);

  if (match == null) {
    return date;
  }

  const [, year, month, day] = match;

  return `${year}. ${Number(month)}. ${Number(day)}`;
};

const formatViewCount = (viewCount: number | string | undefined) => {
  const numericViewCount = Number(viewCount ?? 0);

  if (!Number.isFinite(numericViewCount)) {
    return viewCount ?? '0';
  }

  if (numericViewCount >= TEN_THOUSAND_VIEW_COUNT) {
    return `${Math.floor(numericViewCount / TEN_THOUSAND_VIEW_COUNT)}만`;
  }

  if (numericViewCount >= THOUSAND_VIEW_COUNT) {
    return `${Math.floor(numericViewCount / 100) / 10}천`;
  }

  return String(numericViewCount);
};

const CheckIcon = () => {
  return (
    <svg fill='none' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='m4 9 3 3 7-7'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  );
};

const ProductActionButton = ({
  'aria-label': ariaLabel,
  children,
  disabled,
  onClick,
}: {
  'aria-label': string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      aria-label={ariaLabel}
      className={S.actionButtonClassName}
      disabled={disabled}
      onClick={onClick}
      type='button'
    >
      <span aria-hidden='true' className={S.actionIconClassName}>
        {children}
      </span>
    </button>
  );
};

const ProductSelectionButton = ({
  productName,
  selectLabel,
  selectionState,
  onSelectClick,
}: {
  productName: string;
  selectLabel: string;
  selectionState: Exclude<ProductEditCardDesktopSelectionStateTypes, 'default'>;
  onSelectClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const isSelected = selectionState === 'selected';

  return (
    <button
      aria-label={`${productName} ${selectLabel}`}
      aria-pressed={isSelected}
      className={S.selectionButtonClassName}
      onClick={onSelectClick}
      type='button'
    >
      <span className={S.selectionBoxRecipe({ selected: isSelected })}>
        {isSelected && (
          <span aria-hidden='true' className={S.checkIconClassName}>
            <CheckIcon />
          </span>
        )}
      </span>
    </button>
  );
};

export const ProductEditCardDesktop = ({
  'aria-label': ariaLabel,
  actionsDisabled = false,
  categoryName = DEFAULT_CATEGORY_NAME,
  className,
  deleteLabel = DEFAULT_DELETE_LABEL,
  editLabel = DEFAULT_EDIT_LABEL,
  endDate,
  originalPrice,
  periodDiscountDate = true,
  priceUnit = DEFAULT_PRICE_UNIT,
  productId,
  productName,
  salePercent,
  salePercentUnit = DEFAULT_SALE_PERCENT_UNIT,
  salePrice,
  selectLabel = DEFAULT_SELECT_LABEL,
  selectionState = 'default',
  startDate,
  todayDiscountPrice = true,
  viewCount,
  viewCountLabel = DEFAULT_VIEW_COUNT_LABEL,
  onDeleteClick,
  onEditClick,
  onSelectClick,
  ...props
}: ProductEditCardDesktopProps) => {
  const isSelectionMode = selectionState !== 'default';
  const shouldShowOriginalPrice = todayDiscountPrice && originalPrice != null;
  const shouldShowSalePercent = todayDiscountPrice && salePercent != null;
  const shouldShowDate = endDate != null;
  const shouldShowStartDate = periodDiscountDate && startDate != null;
  const formattedStartDate =
    shouldShowStartDate && startDate != null ? formatDisplayDate(startDate) : undefined;
  const formattedEndDate = endDate != null ? formatDisplayDate(endDate) : undefined;
  const formattedViewCount = formatViewCount(viewCount);
  const dateText = shouldShowDate
    ? `${formattedStartDate != null ? `${formattedStartDate}~` : ''}${formattedEndDate}일까지`
    : undefined;
  const cardLabel = ariaLabel ?? `${productName} 상품 수정 카드`;

  return (
    <article
      aria-label={cardLabel}
      className={cn(S.rootRecipe({ selectionMode: isSelectionMode }), className)}
      data-product-id={productId}
      {...props}
    >
      <div className={S.contentClassName}>
        <header className={S.headerClassName}>
          <div className={S.metaClassName}>
            <span className={S.categoryChipClassName}>
              {formatProductCategoryDisplayName(categoryName)}
            </span>
            <span className={S.viewChipClassName}>
              <span>{formattedViewCount}</span>
              <span>{viewCountLabel}</span>
            </span>
          </div>

          <div className={S.actionGroupClassName}>
            <ProductActionButton
              aria-label={`${productName} ${editLabel}`}
              disabled={actionsDisabled}
              onClick={onEditClick}
            >
              <IcWrite />
            </ProductActionButton>
            <ProductActionButton
              aria-label={`${productName} ${deleteLabel}`}
              disabled={actionsDisabled}
              onClick={onDeleteClick}
            >
              <IcTrash />
            </ProductActionButton>
          </div>
        </header>

        <div className={S.productContentClassName}>
          <h3 className={S.productNameClassName}>{productName}</h3>

          <div className={S.priceContentClassName}>
            {shouldShowOriginalPrice && (
              <span className={S.originalPriceClassName}>
                {originalPrice}
                {priceUnit}
              </span>
            )}
            <div className={S.salePriceRowClassName}>
              {shouldShowSalePercent && (
                <span className={S.salePercentClassName}>
                  {salePercent}
                  {salePercentUnit}
                </span>
              )}
              <span className={S.salePriceClassName}>
                {salePrice}
                {priceUnit}
              </span>
            </div>
          </div>

          {dateText != null && <p className={S.dateClassName}>{dateText}</p>}
        </div>
      </div>

      {isSelectionMode && <div aria-hidden='true' className={S.dimmerClassName} />}

      {isSelectionMode && (
        <ProductSelectionButton
          productName={productName}
          selectLabel={selectLabel}
          selectionState={selectionState}
          onSelectClick={onSelectClick}
        />
      )}
    </article>
  );
};
