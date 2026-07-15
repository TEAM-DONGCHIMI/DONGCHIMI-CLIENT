import { MobileHeader } from '@/shared/components/ui/mobile-header';
import { CLIENT_ROUTES } from '@/shared/constants';

import * as S from './MarketProductsPage.css';
import { MarketProductsBackButton } from './components/MarketProductsBackButton';
import { MarketProductsQueryContent } from './components/market-products-query-content';

type MarketProductsPageProps = Readonly<{
  marketSlug: string;
}>;

export const MarketProductsPage = ({ marketSlug }: MarketProductsPageProps) => {
  return (
    <main className={S.pageClassName}>
      <MobileHeader className={S.headerClassName}>
        <MarketProductsBackButton fallbackHref={CLIENT_ROUTES.markets} />
        <MobileHeader.Title>전단보기</MobileHeader.Title>
      </MobileHeader>

      <div className={S.contentClassName}>
        <MarketProductsQueryContent marketSlug={marketSlug} />
      </div>
    </main>
  );
};
