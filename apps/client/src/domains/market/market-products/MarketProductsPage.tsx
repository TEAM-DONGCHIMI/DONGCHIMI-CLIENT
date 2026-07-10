'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { IcChevronLeft } from '@dongchimi/design-system/icons';

import { MobileHeader } from '@/shared/components/ui/mobile-header';
import { MobileModal } from '@/shared/components/ui/mobile-modal';
import { CLIENT_ROUTES } from '@/shared/constants';

import {
  DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT,
  DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT,
  marketProductsFixture,
  type BusinessDayTypes,
  type BusinessHourTypes,
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

type OpenBusinessHourTypes = Extract<BusinessHourTypes, { isOpen: true }>;

const INITIAL_EVENT_DISCOUNT_PAGE_COUNT = 1;

const getTelHref = (phoneNumber: string) => `tel:${phoneNumber.replaceAll('-', '')}`;
const getShareUrl = (slug: string) => `dongchimi.kr/${slug}`;

const BUSINESS_DAY_BY_DATE_DAY_INDEX = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] satisfies BusinessDayTypes[];

export const getCurrentBusinessCloseTime = (
  businessHours: readonly BusinessHourTypes[],
  date = new Date(),
) => {
  const currentBusinessDay = BUSINESS_DAY_BY_DATE_DAY_INDEX[date.getDay()];

  if (currentBusinessDay == null) {
    return undefined;
  }

  const currentBusinessHour = businessHours.find(
    (businessHour): businessHour is OpenBusinessHourTypes => {
      return businessHour.isOpen && businessHour.days.includes(currentBusinessDay);
    },
  );

  return currentBusinessHour?.close;
};

const getCallModalDescription = ({
  closeTime,
  isOpenNow,
}: {
  closeTime: string | undefined;
  isOpenNow: boolean;
}) => {
  if (!isOpenNow) {
    return '현재 영업 시간이 아니에요.';
  }

  if (closeTime == null) {
    return '현재 영업중';
  }

  return `현재 영업중· ${closeTime}까지`;
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
  const [loadedEventDiscountPageCount, setLoadedEventDiscountPageCount] = useState(
    INITIAL_EVENT_DISCOUNT_PAGE_COUNT,
  );

  const { eventDiscount, market, share, todaySpecial } = marketProductsFixture;
  const shareUrl = getShareUrl(share.slug);
  const telHref = getTelHref(market.marketPhone1);
  const currentBusinessCloseTime = getCurrentBusinessCloseTime(market.businessHours);
  const callModalDescription = getCallModalDescription({
    closeTime: currentBusinessCloseTime,
    isOpenNow: market.isOpenNow,
  });

  const visibleTodaySpecialProducts = isTodaySpecialExpanded
    ? todaySpecial.products
    : todaySpecial.products.slice(0, DEFAULT_TODAY_SPECIAL_VISIBLE_COUNT);
  const lastLoadedEventDiscountPage = eventDiscount.pages[loadedEventDiscountPageCount - 1];
  const hasNextEventDiscountPage =
    lastLoadedEventDiscountPage?.hasNext === true && lastLoadedEventDiscountPage.nextCursor != null;
  const nextEventDiscountCursor = hasNextEventDiscountPage
    ? lastLoadedEventDiscountPage.nextCursor
    : null;

  const eventDiscountProducts = useMemo(() => {
    const loadedEventDiscountProducts = eventDiscount.pages
      .slice(0, loadedEventDiscountPageCount)
      .flatMap((page) => page.products);

    if (selectedCategoryId === EVENT_DISCOUNT_ALL_CATEGORY_ID) {
      return loadedEventDiscountProducts;
    }

    return loadedEventDiscountProducts.filter(
      (product) => product.categoryId === selectedCategoryId,
    );
  }, [eventDiscount.pages, loadedEventDiscountPageCount, selectedCategoryId]);

  const handleLoadNextEventDiscountPage = useCallback(() => {
    setLoadedEventDiscountPageCount((currentPageCount) => {
      return Math.min(currentPageCount + 1, eventDiscount.pages.length);
    });
  }, [eventDiscount.pages.length]);

  const handleSelectEventDiscountCategory = useCallback(
    (categoryId: string) => {
      if (categoryId === selectedCategoryId) {
        return;
      }

      setSelectedCategoryId(categoryId);
      setLoadedEventDiscountPageCount(INITIAL_EVENT_DISCOUNT_PAGE_COUNT);
    },
    [selectedCategoryId],
  );

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

        <div className={S.productSectionsFrameClassName}>
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
            hasNextPage={hasNextEventDiscountPage}
            isCategoryExpanded={isCategoryExpanded}
            marketId={marketId}
            nextCursor={nextEventDiscountCursor}
            onLoadNextPage={handleLoadNextEventDiscountPage}
            onSelectCategory={handleSelectEventDiscountCategory}
            onToggleCategoryExpanded={() =>
              setIsCategoryExpanded((previousValue) => !previousValue)
            }
            products={eventDiscountProducts}
            selectedCategoryId={selectedCategoryId}
            visibleCategoryCount={DEFAULT_EVENT_CATEGORY_VISIBLE_COUNT}
          />
        </div>
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
