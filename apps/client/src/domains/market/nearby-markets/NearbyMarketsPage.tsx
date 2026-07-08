'use client';

import { MobileHeader } from '@/shared/components';

import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';

export const NearbyMarketsPage = () => {
  return (
    <main className={S.pageClassName}>
      <MobileHeader aria-label='앱 헤더'>
        <MobileHeader.Logo>모바일 홈 헤더</MobileHeader.Logo>
      </MobileHeader>

      <NearbyMarketsMapSection />
      <NearbyMarketsSearchSection />
      <NearbyMarketsMarketListSection />
    </main>
  );
};
