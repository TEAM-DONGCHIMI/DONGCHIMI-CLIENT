'use client';

import { useRouter } from 'next/navigation';

import { MartSummaryCard } from '@/shared/components';
import { CLIENT_ROUTES } from '@/shared/constants';

import { NEARBY_MARKETS_FIXTURE } from '../fixtures/nearby-markets-fixtures';
import * as S from '../NearbyMarketsPage.css';

export const NearbyMarketsMarketListSection = () => {
  const router = useRouter();

  return (
    <section aria-label='주변 마트 목록' className={S.marketListSectionClassName}>
      {NEARBY_MARKETS_FIXTURE.map((market) => (
        <MartSummaryCard
          key={market.id}
          areaName={market.areaName}
          discountCount={market.discountCount}
          martName={market.martName}
          onActionClick={() => router.push(CLIENT_ROUTES.market(market.id))}
          products={market.products}
          profileImageAlt={market.profileImageAlt}
          profileImageSrc={market.profileImageSrc}
        />
      ))}
    </section>
  );
};
