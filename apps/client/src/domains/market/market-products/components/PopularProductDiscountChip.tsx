'use client';

import { PointChip } from '@dongchimi/design-system';

import * as S from '../MarketProductsPage.css';

type PopularProductDiscountChipProps = Readonly<{
  discountRate: number;
}>;

export const PopularProductDiscountChip = ({ discountRate }: PopularProductDiscountChipProps) => {
  return (
    <PointChip className={S.discountChipClassName} size='mobile'>{`${discountRate}%`}</PointChip>
  );
};
