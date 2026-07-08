'use client';

import Link from 'next/link';

import { IcLocationSizeSmallColor60 } from '@dongchimi/design-system/icons';

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

      <section aria-label='지도 영역'>
        <div aria-label='지도 영역' className={S.mapAreaClassName} role='img' />
      </section>

      <section aria-labelledby='nearby-markets-title' className={S.searchSectionClassName}>
        <h1 className={S.titleClassName} id='nearby-markets-title'>
          현재 위치를 기준으로
          <br />
          가까운 마트를 보여드릴게요
        </h1>

        <label className={S.locationSearchFieldClassName}>
          <span className={S.visuallyHiddenClassName}>위치 또는 마트 검색</span>
          <IcLocationSizeSmallColor60 aria-hidden='true' className={S.locationIconClassName} />
          <input
            className={S.locationSearchInputClassName}
            placeholder='서울시 마포구 망원동'
            type='search'
          />
        </label>
      </section>

      <section>
        <nav aria-label='마트 탐색'>
          <Link href={CLIENT_ROUTES.market(SAMPLE_MARKET_ID)}>망원 신선마트 전단 보기</Link>
        </nav>
      </section>
    </main>
  );
};
