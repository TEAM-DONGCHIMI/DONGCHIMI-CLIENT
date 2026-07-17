'use client';

import Image from 'next/image';

import { NotFoundPage } from '@/domains/error/not-found/NotFoundPage';
import dongchimiLogo from '@/shared/assets/images/img_pavicon.svg';
import { MobileHeader } from '@/shared/components/ui/mobile-header';

import { useNearbyMarketsMap, useNearbyMarketsMarketList } from './NearbyMarketsClientProvider';
import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';

export const NearbyMarketsPageContent = () => {
  const { isMarketsError } = useNearbyMarketsMap();
  const { isError } = useNearbyMarketsMarketList();

  if (isError || isMarketsError) {
    return <NotFoundPage />;
  }

  return (
    <main className={S.pageClassName}>
      <MobileHeader aria-label='주변 마트 헤더' className={S.homeHeaderClassName}>
        <MobileHeader.Logo>
          <Image
            alt='동치미'
            className={S.logoClassName}
            height={32}
            src={dongchimiLogo}
            width={92}
          />
        </MobileHeader.Logo>
      </MobileHeader>

      <NearbyMarketsSearchSection />
      <NearbyMarketsMapSection />
      <NearbyMarketsMarketListSection />
    </main>
  );
};
