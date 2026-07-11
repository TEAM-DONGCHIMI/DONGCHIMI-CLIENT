import type { ChangeEventHandler } from 'react';

import { IcLocationSizeSmallColor60 } from '@dongchimi/design-system/icons';

import * as S from '../NearbyMarketsPage.css';

export interface NearbyMarketsLocationSearchInputProps {
  onValueChange: (value: string) => void;
  placeholder: string;
  value: string;
}

export const NearbyMarketsLocationSearchInput = ({
  onValueChange,
  placeholder,
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
        placeholder={placeholder}
        type='search'
        value={value}
        onChange={handleChange}
      />
    </label>
  );
};
