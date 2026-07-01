import Link from 'next/link';

import { CLIENT_ROUTES } from '@/shared/constants';

const SAMPLE_MARKET_ID = 'mangwon-fresh';

export const NearbyMarketsPage = () => {
  return (
    <main>
      <section aria-labelledby='nearby-markets-title'>
        <p>현재 위치 기반</p>
        <h1 id='nearby-markets-title'>내 주변 마트</h1>
        <p>지도와 목록으로 주변 마트와 전단을 탐색하는 화면입니다.</p>

        <nav aria-label='마트 탐색'>
          <Link href={CLIENT_ROUTES.market(SAMPLE_MARKET_ID)}>망원 신선마트 전단 보기</Link>
        </nav>
      </section>
    </main>
  );
};
