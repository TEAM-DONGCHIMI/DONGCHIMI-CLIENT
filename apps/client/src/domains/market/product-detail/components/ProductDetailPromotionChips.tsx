'use client';

import { Chip } from '@dongchimi/design-system';

import type { ProductDetailPromotionTypes } from '../../model/product-detail-schema';
import * as S from '../ProductDetailPage.css';

type ProductDetailPromotionChipsProps = Readonly<{
  label: string;
  promotion: ProductDetailPromotionTypes;
}>;

type EventPeriodChipProps = Readonly<{
  promotion: ProductDetailPromotionTypes;
}>;

const EventPeriodChip = ({ promotion }: EventPeriodChipProps) => {
  if (promotion.type !== 'event-discount') {
    return null;
  }

  return (
    <Chip
      className={S.promotionPeriodChipClassName}
      color='neutral'
      rounded={false}
      size='desktop'
      variant='subtle'
    >
      {promotion.periodText}
    </Chip>
  );
};

export const ProductDetailPromotionChips = ({
  label,
  promotion,
}: ProductDetailPromotionChipsProps) => {
  return (
    <div aria-label='상품 행사 정보' className={S.chipRowClassName} role='group'>
      <Chip className={S.promotionLabelChipClassName} color='primary' size='desktop' variant='soft'>
        {label}
      </Chip>
      <EventPeriodChip promotion={promotion} />
    </div>
  );
};
