'use client';

import { useState } from 'react';

import { MobileHeader } from '@/shared/components';
import { useDebouncedValue } from '@/shared/hooks';

import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';

export const NearbyMarketsPage = () => {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword);

  return (
    <main className={S.pageClassName}>
      <MobileHeader aria-label='앱 헤더'>
        <MobileHeader.Logo>모바일 홈 헤더</MobileHeader.Logo>
      </MobileHeader>

      <NearbyMarketsMapSection />
      <NearbyMarketsSearchSection keyword={keyword} onKeywordChange={setKeyword} />
      <NearbyMarketsMarketListSection keyword={debouncedKeyword} />
    </main>
  );
};
