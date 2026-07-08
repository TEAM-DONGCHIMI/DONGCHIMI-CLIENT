import { IcLocationSizeSmallColor60 } from '@dongchimi/design-system/icons';

import * as S from '../NearbyMarketsPage.css';

export const NearbyMarketsLocationSearchInput = () => {
  return (
    <label className={S.locationSearchFieldClassName}>
      <span className={S.visuallyHiddenClassName}>위치 또는 마트 검색</span>
      <IcLocationSizeSmallColor60 aria-hidden='true' className={S.locationIconClassName} />
      <input
        className={S.locationSearchInputClassName}
        placeholder='서울시 마포구 망원동'
        type='search'
      />
    </label>
  );
};
