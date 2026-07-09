import type { ChangeEventHandler } from 'react';

import { IcLocationSizeSmallColor60 } from '@dongchimi/design-system/icons';

import * as S from '../NearbyMarketsPage.css';

export interface NearbyMarketsLocationSearchInputProps {
  onValueChange: (value: string) => void;
  value: string;
}

export const NearbyMarketsLocationSearchInput = ({
  onValueChange,
  value,
}: NearbyMarketsLocationSearchInputProps) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onValueChange(event.target.value);
  };

  return (
    <label className={S.locationSearchFieldClassName}>
      <span className={S.visuallyHiddenClassName}>위치 또는 마트 검색</span>
      <IcLocationSizeSmallColor60 aria-hidden='true' className={S.locationIconClassName} />
      <input
        className={S.locationSearchInputClassName}
        placeholder='서울시 마포구 망원동'
        type='search'
        value={value}
        onChange={handleChange}
      />
    </label>
  );
};
