'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { IcChevronLeft } from '@dongchimi/design-system/icons';

import { MobileHeader } from '@/shared/components/ui/mobile-header';
import { MobileModal } from '@/shared/components/ui/mobile-modal';
import { CLIENT_ROUTES } from '@/shared/constants';

import {
  DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT,
  DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT,
  marketProductsFixture,
} from './fixtures/market-products.fixture';
import * as S from './MarketProductsPage.css';
import {
  EVENT_DISCOUNT_ALL_CATEGORY_ID,
  EventDiscountProductsSection,
} from './sections/EventDiscountProductsSection';
import { MarketOverviewSection } from './sections/MarketOverviewSection';
import { PopularProductsSection } from './sections/PopularProductsSection';
import { TodaySpecialProductsSection } from './sections/TodaySpecialProductsSection';

type MarketProductsPageProps = Readonly<{
  marketId: string;
}>;

const getTelHref = (phoneNumber: string) => `tel:${phoneNumber.replaceAll('-', '')}`;
const getShareUrl = (slug: string) => `dongchimi.kr/${slug}`;
const getCurrentBusinessCloseTime = (
  businessHours: typeof marketProductsFixture.market.businessHours,
) => {
  return businessHours.find((businessHour) => businessHour.isOpen)?.close;
};

const MarketProductsBackButton = () => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(CLIENT_ROUTES.markets);
  };

  return (
    <MobileHeader.BackButton
      aria-label='마트 목록으로 돌아가기'
      icon={<IcChevronLeft />}
      onClick={handleBackButtonClick}
    />
  );
};

export const MarketProductsPage = ({ marketId }: MarketProductsPageProps) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isTodaySpecialExpanded, setIsTodaySpecialExpanded] = useState(false);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(EVENT_DISCOUNT_ALL_CATEGORY_ID);

  const { eventDiscount, market, share, todaySpecial } = marketProductsFixture;
  const shareUrl = getShareUrl(share.slug);
  const telHref = getTelHref(market.marketPhone1);
  const currentBusinessCloseTime = getCurrentBusinessCloseTime(market.businessHours);
  const callModalDescription =
    market.isOpenNow && currentBusinessCloseTime != null
      ? `현재 영업중· ${currentBusinessCloseTime}까지`
      : '현재 영업 시간이 아니에요.';

  const visibleTodaySpecialProducts = isTodaySpecialExpanded
    ? todaySpecial.products
    : todaySpecial.products.slice(0, DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT);

  const eventDiscountProducts = useMemo(() => {
    if (selectedCategoryId === EVENT_DISCOUNT_ALL_CATEGORY_ID) {
      return eventDiscount.products;
    }

    return eventDiscount.products.filter((product) => product.categoryId === selectedCategoryId);
  }, [eventDiscount.products, selectedCategoryId]);

  const handleConfirmCall = () => {
    window.location.href = telHref;
    setIsCallModalOpen(false);
  };

  return (
    <main className={S.pageClassName}>
      <MobileHeader className={S.headerClassName}>
        <MarketProductsBackButton />
        <MobileHeader.Title>전단보기</MobileHeader.Title>
      </MobileHeader>

      <div className={S.contentClassName}>
        <MarketOverviewSection
          market={market}
          onOpenCallModal={() => setIsCallModalOpen(true)}
          shareUrl={shareUrl}
        />

        <PopularProductsSection marketId={marketId} products={market.top3} />

        <TodaySpecialProductsSection
          isExpanded={isTodaySpecialExpanded}
          marketId={marketId}
          onToggleExpanded={() => setIsTodaySpecialExpanded((previousValue) => !previousValue)}
          products={visibleTodaySpecialProducts}
          totalCount={todaySpecial.totalCount}
        />

        <EventDiscountProductsSection
          categories={eventDiscount.categories}
          isCategoryExpanded={isCategoryExpanded}
          marketId={marketId}
          onSelectCategory={setSelectedCategoryId}
          onToggleCategoryExpanded={() => setIsCategoryExpanded((previousValue) => !previousValue)}
          products={eventDiscountProducts}
          selectedCategoryId={selectedCategoryId}
          visibleCategoryCount={DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT}
        />
      </div>

      <MobileModal
        confirmLabel='전화걸기'
        description={callModalDescription}
        onConfirm={handleConfirmCall}
        onOpenChange={setIsCallModalOpen}
        open={isCallModalOpen}
        subText={market.marketPhone1}
        title={`${market.name}에 전화할까요?`}
      />
    </main>
  );
};
