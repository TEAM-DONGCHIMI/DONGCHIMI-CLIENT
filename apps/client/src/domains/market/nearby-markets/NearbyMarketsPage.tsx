import Image from 'next/image';

import dongchimiLogo from '@/shared/assets/images/img_pavicon.svg';
import { MobileHeader } from '@/shared/components/ui/mobile-header';

import { NearbyMarketsClientProvider } from './NearbyMarketsClientProvider';
import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';

export const NearbyMarketsPage = () => {
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

      <NearbyMarketsClientProvider>
        <NearbyMarketsSearchSection />
        <NearbyMarketsMapSection />
        <NearbyMarketsMarketListSection />
      </NearbyMarketsClientProvider>
    </main>
  );
};
