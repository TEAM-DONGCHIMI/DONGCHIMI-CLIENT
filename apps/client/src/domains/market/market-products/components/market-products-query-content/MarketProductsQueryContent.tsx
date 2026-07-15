'use client';

import { Button } from '@dongchimi/design-system';

import { useMarketDetailQuery } from '@/domains/market/hooks/use-market-detail-query';

import {
  DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT,
  DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT,
  marketProductsFixture,
} from '../../fixtures/market-products.fixture';
import * as S from '../../MarketProductsPage.css';
import { EventDiscountProductsSection } from '../../sections/EventDiscountProductsSection';
import { MarketOverviewSection } from '../../sections/MarketOverviewSection';
import { PopularProductsSection } from '../../sections/PopularProductsSection';
import { TodaySpecialProductsSection } from '../../sections/TodaySpecialProductsSection';
import { getShareUrl } from '../../utils/market-actions';

export type MarketProductsQueryContentProps = Readonly<{
  marketSlug: string;
}>;

export const MarketProductsQueryContent = ({ marketSlug }: MarketProductsQueryContentProps) => {
  const { data: market, isError, isPending, refetch } = useMarketDetailQuery({ slug: marketSlug });

  if (isPending) {
    return (
      <div className={S.queryStateClassName}>
        <p role='status'>마트 정보를 불러오는 중이에요.</p>
      </div>
    );
  }

  if (isError || market == null) {
    return (
      <div className={S.queryStateClassName}>
        <p role='alert'>마트 정보를 불러오지 못했어요.</p>
        <Button onClick={() => void refetch()} size='mobile'>
          다시 시도
        </Button>
      </div>
    );
  }

  const { eventDiscount, todaySpecial } = marketProductsFixture;
  const shareUrl = getShareUrl(marketSlug);

  return (
    <>
      <MarketOverviewSection market={market} shareUrl={shareUrl} />

      <div className={S.productSectionsFrameClassName}>
        <PopularProductsSection marketSlug={marketSlug} products={market.top3} />

        <TodaySpecialProductsSection
          initialVisibleCount={DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT}
          marketSlug={marketSlug}
          products={todaySpecial.products}
          totalCount={todaySpecial.totalCount}
        />

        <EventDiscountProductsSection
          eventDiscount={eventDiscount}
          marketSlug={marketSlug}
          visibleCategoryCount={DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT}
        />
      </div>
    </>
  );
};
