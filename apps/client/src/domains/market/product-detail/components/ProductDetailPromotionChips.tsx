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
    <Chip color='neutral' rounded={false} size='mobile' variant='subtle'>
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
      <Chip color='primary' size='mobile' variant='soft'>
        {label}
      </Chip>
      <EventPeriodChip promotion={promotion} />
    </div>
  );
};
