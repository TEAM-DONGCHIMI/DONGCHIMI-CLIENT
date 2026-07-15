'use client';

import type { ReactNode } from 'react';

import { Button } from '@dongchimi/design-system';

import { useDailyProductsQuery } from '@/domains/market/hooks/use-daily-products-query';
import { useMarketDetailQuery } from '@/domains/market/hooks/use-market-detail-query';

import {
  DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT,
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

type TodaySpecialProductsQuerySectionProps = Readonly<{
  marketId: number;
  marketSlug: string;
}>;

const TodaySpecialProductsQueryState = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <section aria-labelledby='today-special-products-title' className={S.todaySpecialCardClassName}>
      <div className={S.sectionHeaderClassName}>
        <h2 className={S.sectionTitleClassName} id='today-special-products-title'>
          오늘의 특가 상품
        </h2>
      </div>
      <div className={S.todaySpecialQueryStateClassName}>{children}</div>
    </section>
  );
};

const TodaySpecialProductsQuerySection = ({
  marketId,
  marketSlug,
}: TodaySpecialProductsQuerySectionProps) => {
  const { data, isError, isPending, refetch } = useDailyProductsQuery({ marketId });

  if (isPending) {
    return (
      <TodaySpecialProductsQueryState>
        <p role='status'>오늘의 특가 상품을 불러오는 중이에요.</p>
      </TodaySpecialProductsQueryState>
    );
  }

  if (isError || data == null) {
    return (
      <TodaySpecialProductsQueryState>
        <p role='alert'>오늘의 특가 상품을 불러오지 못했어요.</p>
        <Button onClick={() => void refetch()} size='mobile'>
          오늘의 특가 다시 시도
        </Button>
      </TodaySpecialProductsQueryState>
    );
  }

  return (
    <TodaySpecialProductsSection
      marketSlug={marketSlug}
      products={data.products}
      totalCount={data.totalCount}
    />
  );
};

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

  const { eventDiscount } = marketProductsFixture;
  const shareUrl = getShareUrl(marketSlug);

  return (
    <>
      <MarketOverviewSection market={market} shareUrl={shareUrl} />

      <div className={S.productSectionsFrameClassName}>
        <PopularProductsSection marketSlug={marketSlug} products={market.top3} />

        <TodaySpecialProductsQuerySection marketId={market.marketId} marketSlug={marketSlug} />

        <EventDiscountProductsSection
          eventDiscount={eventDiscount}
          marketSlug={marketSlug}
          visibleCategoryCount={DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT}
        />
      </div>
    </>
  );
};
