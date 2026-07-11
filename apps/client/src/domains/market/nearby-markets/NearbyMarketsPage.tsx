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
      <MobileHeader aria-label='mobile header'>
        <MobileHeader.Logo>
          <div aria-label='logo' className={S.logoPlaceholderClassName} role='img' />
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
