import { type ComponentPropsWithoutRef, type MouseEventHandler, type ReactNode } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import * as S from './ProductEditCardDesktop.css';

type NativeArticleProps = Omit<ComponentPropsWithoutRef<'article'>, 'children' | 'onClick'>;

export type ProductEditCardDesktopSelectionStateTypes = 'default' | 'selectable' | 'selected';

export interface ProductEditCardDesktopProps extends NativeArticleProps {
  categoryName?: string;
  deleteLabel?: string;
  editLabel?: string;
  endDate?: string;
  originalPrice?: string;
  periodDiscountDate?: boolean;
  priceUnit?: string;
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

const WriteIcon = () => {
  return (
    <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M13.5 5.5H5.75C4.78 5.5 4 6.28 4 7.25v11c0 .97.78 1.75 1.75 1.75h11c.97 0 1.75-.78 1.75-1.75V10.5'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='m10 14 1.2-3.4L17.8 4a1.56 1.56 0 0 1 2.2 2.2l-6.6 6.6L10 14Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  );
};

const TrashIcon = () => {
  return (
    <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <path d='M4 7h16' stroke='currentColor' strokeLinecap='round' strokeWidth='2' />
      <path
        d='M9 7V5.75C9 4.78 9.78 4 10.75 4h2.5C14.22 4 15 4.78 15 5.75V7'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='m6.5 7 .72 11.52A1.6 1.6 0 0 0 8.82 20h6.36a1.6 1.6 0 0 0 1.6-1.48L17.5 7'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path d='M10 10.5v6M14 10.5v6' stroke='currentColor' strokeLinecap='round' strokeWidth='2' />
    </svg>
  );
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
  onClick,
}: {
  'aria-label': string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      aria-label={ariaLabel}
      className={S.actionButtonClassName}
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
  categoryName = DEFAULT_CATEGORY_NAME,
  className,
  deleteLabel = DEFAULT_DELETE_LABEL,
  editLabel = DEFAULT_EDIT_LABEL,
  endDate,
  originalPrice,
  periodDiscountDate = true,
  priceUnit = DEFAULT_PRICE_UNIT,
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
  const dateText = shouldShowDate
    ? `${shouldShowStartDate ? `${startDate}~` : ''}${endDate}일까지`
    : undefined;
  const cardLabel = ariaLabel ?? `${productName} 상품 수정 카드`;

  return (
    <article
      aria-label={cardLabel}
      className={cn(S.rootRecipe({ selectionMode: isSelectionMode }), className)}
      {...props}
    >
      <div className={S.contentClassName}>
        <header className={S.headerClassName}>
          <div className={S.metaClassName}>
            <span className={S.categoryChipClassName}>{categoryName}</span>
            {viewCount != null && (
              <span className={S.viewChipClassName}>
                <span>{viewCount}</span>
                <span>{viewCountLabel}</span>
              </span>
            )}
          </div>

          <div className={S.actionGroupClassName}>
            <ProductActionButton aria-label={`${productName} ${editLabel}`} onClick={onEditClick}>
              <WriteIcon />
            </ProductActionButton>
            <ProductActionButton
              aria-label={`${productName} ${deleteLabel}`}
              onClick={onDeleteClick}
            >
              <TrashIcon />
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
