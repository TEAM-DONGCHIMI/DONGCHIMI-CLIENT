import { List } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';
import { useId, useState } from 'react';

import * as S from './ProductCard.css';
import { ProductItem } from './ProductItem';
import { type ProductCardProps } from './ProductCard.types';
import { DEFAULT_VISIBLE_COUNT, formatProductCardCount } from './ProductCard.utils';

export type { ProductCardItemTypes, ProductCardProps } from './ProductCard.types';

export const ProductCard = ({
  actionSlot,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledByProp,
  className,
  collapseLabel = '상품 접기',
  emptyMessage = '표시할 상품이 없습니다.',
  id,
  initialVisibleCount = DEFAULT_VISIBLE_COUNT,
  itemVariant = 'today',
  items,
  onProductClick,
  showMoreLabel = '더 많은 상품 보기',
  surface = 'elevated',
  title,
  totalCount,
  ...sectionProps
}: ProductCardProps) => {
  const generatedId = useId();
  const headingId = id ? `${id}-title` : `${generatedId}-title`;
  const listId = id ? `${id}-list` : `${generatedId}-list`;
  const [isExpanded, setIsExpanded] = useState(false);

  // 초기 노출 개수와 펼침 상태를 기준으로 실제 렌더링할 상품을 계산합니다.
  const visibleCount = Math.max(0, initialVisibleCount);
  const hasItems = items.length > 0;
  const hasHiddenItems = items.length > visibleCount;
  const visibleItems = isExpanded ? items : items.slice(0, visibleCount);
  const hasActionSlot = Boolean(actionSlot);
  const shouldShowDefaultToggle = !hasActionSlot && hasHiddenItems;
  const shouldShowFooter = hasActionSlot || shouldShowDefaultToggle;
  const count = totalCount ?? items.length;
  const formattedCount = formatProductCardCount(count);
  const toggleLabel = isExpanded ? collapseLabel : showMoreLabel;
  const ariaLabelledBy = ariaLabelledByProp ?? (ariaLabel ? undefined : headingId);

  return (
    <section
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(S.cardClassName, S.cardSurfaceClassNames[surface], className)}
      id={id}
      {...sectionProps}
    >
      <div className={S.contentClassName}>
        <div className={S.bodyClassName}>
          {/* 카드 제목과 전체 상품 수 영역 */}
          <header className={S.headerClassName}>
            <h2 className={S.titleClassName} id={headingId}>
              {title}
            </h2>
            <span aria-label={`총 ${formattedCount}건`} className={S.countClassName}>
              {formattedCount}건
            </span>
          </header>

          {/* 상품이 있으면 목록을, 없으면 empty 상태를 노출합니다. */}
          {hasItems ? (
            <List aria-labelledby={headingId} className={S.listClassName} gap='md' id={listId}>
              {visibleItems.map((item, index) => (
                <ProductItem
                  item={item}
                  itemVariant={itemVariant}
                  key={item.id}
                  onProductClick={onProductClick}
                  position={index}
                />
              ))}
            </List>
          ) : (
            <p className={S.emptyClassName}>{emptyMessage}</p>
          )}
        </div>

        {/* 외부 actionSlot이 있으면 우선 사용하고, 없으면 내부 더보기/접기를 사용합니다. */}
        {shouldShowFooter && (
          <div className={S.footerClassName}>
            {hasActionSlot ? actionSlot : null}
            {shouldShowDefaultToggle && (
              <button
                aria-controls={listId}
                aria-expanded={isExpanded}
                className={S.toggleButtonClassName}
                onClick={() => setIsExpanded((current) => !current)}
                type='button'
              >
                {toggleLabel}
                <span
                  aria-hidden='true'
                  className={cn(S.toggleIconClassName, isExpanded && S.toggleIconExpandedClassName)}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
