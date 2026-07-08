'use client';

import Link from 'next/link';

import { MobileHeader } from '@/shared/components';
import { CLIENT_ROUTES } from '@/shared/constants';

import * as S from './NearbyMarketsPage.css';

const SAMPLE_MARKET_ID = 'mangwon-fresh';

export const NearbyMarketsPage = () => {
  return (
    <main className={S.pageClassName}>
      <MobileHeader aria-label='앱 헤더'>
        <MobileHeader.Logo>모바일 홈 헤더</MobileHeader.Logo>
      </MobileHeader>

      <section aria-labelledby='map'>
        <div aria-label='지도 영역' className={S.mapAreaClassName} role='img' />
      </section>

      <section aria-labelledby='nearby-markets-title'>
        <nav aria-label='마트 탐색'>
          <Link href={CLIENT_ROUTES.market(SAMPLE_MARKET_ID)}>망원 신선마트 전단 보기</Link>
        </nav>
      </section>
    </main>
  );
};
