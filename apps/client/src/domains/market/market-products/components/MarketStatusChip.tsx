'use client';

import { Chip } from '@dongchimi/design-system';

import * as S from '../MarketProductsPage.css';

type MarketStatusChipProps = Readonly<{
  isOpenNow: boolean;
}>;

export const MarketStatusChip = ({ isOpenNow }: MarketStatusChipProps) => {
  if (!isOpenNow) {
    return (
      <Chip
        className={S.marketStatusChipClassName}
        color='neutral'
        rounded={false}
        size='desktop'
        variant='subtle'
      >
        영업 종료
      </Chip>
    );
  }

  return (
    <Chip className={S.marketStatusChipClassName} color='primary' size='mobile' variant='soft'>
      영업중
    </Chip>
  );
};
