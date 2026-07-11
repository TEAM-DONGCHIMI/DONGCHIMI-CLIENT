'use client';

import { NearbyMarketsLocationSearchInput } from '../components/NearbyMarketsLocationSearchInput';
import { useNearbyMarketsSearch } from '../NearbyMarketsClientProvider';
import * as S from '../NearbyMarketsPage.css';

export const NearbyMarketsSearchSection = () => {
  const { keyword, onKeywordChange, onKeywordClick, placeholder, readOnly } =
    useNearbyMarketsSearch();

  return (
    <section aria-labelledby='nearby-markets-title' className={S.searchSectionClassName}>
      <h1 className={S.titleClassName} id='nearby-markets-title'>
        현재 위치를 기준으로
        <br />
        가까운 마트를 보여드릴게요
      </h1>

      <NearbyMarketsLocationSearchInput
        onClick={onKeywordClick}
        onValueChange={onKeywordChange}
        placeholder={placeholder}
        readOnly={readOnly}
        value={keyword}
      />
    </section>
  );
};
