import { type ComponentPropsWithoutRef, type MouseEventHandler, type ReactNode } from 'react';

import { IcTrash, IcWrite } from '@dongchimi/design-system/icons';
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
              <IcWrite />
            </ProductActionButton>
            <ProductActionButton
              aria-label={`${productName} ${deleteLabel}`}
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
