'use client';

import { Chip } from '@dongchimi/design-system';

import * as S from '../MarketProductsPage.css';

type MarketStatusChipProps = Readonly<{
  isOpenNow: boolean;
}>;

export const MarketStatusChip = ({ isOpenNow }: MarketStatusChipProps) => {
  return (
    <Chip className={S.marketStatusChipClassName} color='primary' size='mobile' variant='soft'>
      {isOpenNow ? '영업중' : '영업 종료'}
    </Chip>
  );
};
