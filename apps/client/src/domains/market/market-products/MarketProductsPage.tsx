import { MobileHeader } from '@/shared/components/ui/mobile-header';
import { CLIENT_ROUTES } from '@/shared/constants';

import {
  DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT,
  DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT,
  marketProductsFixture,
} from './fixtures/market-products.fixture';
import * as S from './MarketProductsPage.css';
import { MarketProductsBackButton } from './components/MarketProductsBackButton';
import { EventDiscountProductsSection } from './sections/EventDiscountProductsSection';
import { MarketOverviewSection } from './sections/MarketOverviewSection';
import { PopularProductsSection } from './sections/PopularProductsSection';
import { TodaySpecialProductsSection } from './sections/TodaySpecialProductsSection';
import { getShareUrl } from './utils/market-actions';

type MarketProductsPageProps = Readonly<{
  marketId: string;
}>;

export const MarketProductsPage = ({ marketId }: MarketProductsPageProps) => {
  const { eventDiscount, market, share, todaySpecial } = marketProductsFixture;
  const shareUrl = getShareUrl(share.slug);

  return (
    <main className={S.pageClassName}>
      <MobileHeader className={S.headerClassName}>
        <MarketProductsBackButton fallbackHref={CLIENT_ROUTES.markets} />
        <MobileHeader.Title>전단보기</MobileHeader.Title>
      </MobileHeader>

      <div className={S.contentClassName}>
        <MarketOverviewSection market={market} shareUrl={shareUrl} />

        <div className={S.productSectionsFrameClassName}>
          <PopularProductsSection marketId={marketId} products={market.top3} />

          <TodaySpecialProductsSection
            initialVisibleCount={DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT}
            marketId={marketId}
            products={todaySpecial.products}
            totalCount={todaySpecial.totalCount}
          />

          <EventDiscountProductsSection
            eventDiscount={eventDiscount}
            marketId={marketId}
            visibleCategoryCount={DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT}
          />
        </div>
      </div>
    </main>
  );
};
