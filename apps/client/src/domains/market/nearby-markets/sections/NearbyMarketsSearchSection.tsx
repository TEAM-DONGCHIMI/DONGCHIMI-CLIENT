'use client';

import { NearbyMarketsLocationSearchInput } from '../components/NearbyMarketsLocationSearchInput';
import { useNearbyMarketsSearch } from '../NearbyMarketsClientProvider';
import * as S from '../NearbyMarketsPage.css';

export const NearbyMarketsSearchSection = () => {
  const { keyword, onKeywordChange, placeholder } = useNearbyMarketsSearch();

  return (
    <section aria-labelledby='nearby-markets-title' className={S.searchSectionClassName}>
      <h1 className={S.titleClassName} id='nearby-markets-title'>
        현재 위치를 기준으로
        <br />
        가까운 마트를 보여드릴게요
      </h1>

      <NearbyMarketsLocationSearchInput
        onValueChange={onKeywordChange}
        placeholder={placeholder}
        value={keyword}
      />
    </section>
  );
};
