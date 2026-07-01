import { List } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './ProductCard.css';
import { type ProductCardItemTypes, type ProductCardItemVariantTypes } from './ProductCard.types';
import { getProductCardBadgeLabel } from './ProductCard.utils';

interface ProductItemProps {
  item: ProductCardItemTypes;
  itemVariant: ProductCardItemVariantTypes;
  onProductClick: (item: ProductCardItemTypes, index: number) => void;
  position: number;
}

export const ProductItem = ({ item, itemVariant, onProductClick, position }: ProductItemProps) => {
  const isPeriodItem = itemVariant === 'period';
  const badgeLabel = getProductCardBadgeLabel(item);
  const rank = item.rank ?? position + 1;
  const imageAlt = item.imageAlt ?? `${item.name} 상품 이미지`;

  const productMedia = (
    <span className={S.imageFrameClassName}>
      {item.imageUrl ? (
        <img alt={imageAlt} className={S.imageClassName} src={item.imageUrl} />
      ) : (
        <span aria-hidden='true' className={S.imagePlaceholderClassName} />
      )}
    </span>
  );

  const productInfo = (
    <span className={S.infoClassName}>
      <span className={S.productNameClassName}>{item.name}</span>
      <span className={S.priceRowClassName}>
        <span className={S.currentPriceClassName}>{item.priceText}</span>
        {item.originalPriceText ? (
          <span className={S.originalPriceClassName}>{item.originalPriceText}</span>
        ) : null}
      </span>
    </span>
  );

  return (
    <List.Item className={S.productItemClassName}>
      {/* 상품 상세 진입을 위한 클릭 영역 */}
      <button
        aria-label={`상품 보기: ${item.name}`}
        className={S.itemButtonClassName}
        onClick={() => onProductClick(item, position)}
        type='button'
      >
        <span className={S.productItemLayoutClassName}>
          {/* 상품 이미지, 이름, 가격을 묶는 본문 영역 */}
          <span
            className={cn(S.productMainClassName, isPeriodItem && S.productMainWithRankClassName)}
          >
            {isPeriodItem ? (
              <>
                {/* 기간 할인 상품은 순위를 함께 노출합니다. */}
                <span aria-hidden='true' className={S.rankClassName}>
                  {rank}
                </span>
                <span className={S.productContentWithRankClassName}>
                  {productMedia}
                  {productInfo}
                </span>
              </>
            ) : (
              <>
                {productMedia}
                {productInfo}
              </>
            )}
          </span>
          {/* 오늘의 특가 상품에만 할인 칩을 노출합니다. */}
          {badgeLabel && !isPeriodItem ? (
            <span aria-label={`${badgeLabel} 할인`} className={S.badgeClassName}>
              {badgeLabel}
            </span>
          ) : null}
        </span>
      </button>
    </List.Item>
  );
};
