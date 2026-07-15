import type { ChangeEventHandler, MouseEventHandler } from 'react';

import { IcLocationSizeSmallColor60 } from '@dongchimi/design-system/icons';

import * as S from '../NearbyMarketsPage.css';

export interface NearbyMarketsLocationSearchInputProps {
  onClick?: () => void;
  onValueChange: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  value: string;
}

export const NearbyMarketsLocationSearchInput = ({
  onClick,
  onValueChange,
  placeholder,
  readOnly = false,
  value,
}: NearbyMarketsLocationSearchInputProps) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onValueChange(event.target.value);
  };

  const handleClick: MouseEventHandler<HTMLInputElement> = () => {
    onClick?.();
  };

  return (
    <label className={S.locationSearchFieldClassName}>
      <span className={S.visuallyHiddenClassName}>위치 또는 마트 검색</span>
      <IcLocationSizeSmallColor60 aria-hidden='true' className={S.locationIconClassName} />
      <input
        className={S.locationSearchInputClassName}
        placeholder={placeholder}
        readOnly={readOnly}
        type='search'
        value={value}
        onChange={handleChange}
        onClick={handleClick}
      />
    </label>
  );
};
