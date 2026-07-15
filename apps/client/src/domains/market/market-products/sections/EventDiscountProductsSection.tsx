'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PillButton } from '@dongchimi/design-system';
import { IcChevronDown, IcChevronUp } from '@dongchimi/design-system/icons';
import { PeriodProductCard } from '@/shared/components/ui/period-product-card';
import { CLIENT_ROUTES } from '@/shared/constants';

import { useEventDiscountCategoryLayout } from '../hooks/useEventDiscountCategoryLayout';
import type { EventDiscountProductsFixtureTypes } from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';
import { formatPrice } from '../utils/format-price';

interface EventDiscountProductsSectionProps {
  eventDiscount: EventDiscountProductsFixtureTypes;
  marketId: string;
  visibleCategoryCount: number;
}

export const EVENT_DISCOUNT_ALL_CATEGORY_ID = 'all';

const EVENT_DISCOUNT_PRODUCT_IMAGE_SIZES = 'calc((100vw - 10rem) / 3)';

const INITIAL_EVENT_DISCOUNT_PAGE_COUNT = 1;

const EVENT_DISCOUNT_PRELOAD_ROOT_MARGIN = '0px 0px 240px';

type UseEventDiscountInfiniteScrollTypes = Readonly<{
  hasNextPage: boolean;
  nextCursor: number | null;
  onLoadNextPage: () => void;
}>;

const useEventDiscountInfiniteScroll = ({
  hasNextPage,
  nextCursor,
  onLoadNextPage,
}: UseEventDiscountInfiniteScrollTypes) => {
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const hasRequestedNextPageRef = useRef(false);

  useEffect(() => {
    hasRequestedNextPageRef.current = false;
  }, [nextCursor]);

  useEffect(() => {
    const loadMoreSentinelElement = loadMoreSentinelRef.current;

    if (
      !hasNextPage ||
      loadMoreSentinelElement == null ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const isLoadMoreSentinelVisible = entries.some((entry) => entry.isIntersecting);

        if (!isLoadMoreSentinelVisible || hasRequestedNextPageRef.current) {
          return;
        }

        hasRequestedNextPageRef.current = true;
        onLoadNextPage();
      },
      {
        rootMargin: EVENT_DISCOUNT_PRELOAD_ROOT_MARGIN,
      },
    );

    intersectionObserver.observe(loadMoreSentinelElement);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [hasNextPage, nextCursor, onLoadNextPage]);

  return loadMoreSentinelRef;
};

export const EventDiscountProductsSection = ({
  eventDiscount,
  marketId,
  visibleCategoryCount,
}: EventDiscountProductsSectionProps) => {
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(EVENT_DISCOUNT_ALL_CATEGORY_ID);
  const [loadedEventDiscountPageCount, setLoadedEventDiscountPageCount] = useState(
    INITIAL_EVENT_DISCOUNT_PAGE_COUNT,
  );
  const { categories, pages } = eventDiscount;
  const lastLoadedEventDiscountPage = pages[loadedEventDiscountPageCount - 1];
  const hasNextPage =
    lastLoadedEventDiscountPage?.hasNext === true && lastLoadedEventDiscountPage.nextCursor != null;
  const nextCursor = hasNextPage ? lastLoadedEventDiscountPage.nextCursor : null;
  const products = useMemo(() => {
    const loadedProducts = pages
      .slice(0, loadedEventDiscountPageCount)
      .flatMap((page) => page.products);

    if (selectedCategoryId === EVENT_DISCOUNT_ALL_CATEGORY_ID) {
      return loadedProducts;
    }

    return loadedProducts.filter((product) => product.categoryId === selectedCategoryId);
  }, [loadedEventDiscountPageCount, pages, selectedCategoryId]);
  const handleLoadNextPage = useCallback(() => {
    setLoadedEventDiscountPageCount((currentPageCount) => {
      return Math.min(currentPageCount + 1, pages.length);
    });
  }, [pages.length]);
  const handleSelectCategory = useCallback(
    (categoryId: string) => {
      if (categoryId === selectedCategoryId) {
        return;
      }

      setSelectedCategoryId(categoryId);
      setLoadedEventDiscountPageCount(INITIAL_EVENT_DISCOUNT_PAGE_COUNT);
    },
    [selectedCategoryId],
  );
  const loadMoreSentinelRef = useEventDiscountInfiniteScroll({
    hasNextPage,
    nextCursor,
    onLoadNextPage: handleLoadNextPage,
  });
  const { categoryMeasureRowRef, categoryPrimaryRowRef, firstRowCategoryCount } =
    useEventDiscountCategoryLayout({
      categories,
      visibleCategoryCount,
    });

  const defaultVisibleCategories = categories.slice(0, firstRowCategoryCount);
  const hiddenCategories = categories.slice(firstRowCategoryCount);
  const hasHiddenCategories = hiddenCategories.length > 0;
  const hasExpandedCategories = isCategoryExpanded && hasHiddenCategories;
  const MoreButtonIcon = isCategoryExpanded ? IcChevronUp : IcChevronDown;

  return (
    <section aria-labelledby='event-discount-products-title' className={S.cardSectionClassName}>
      <h2 className={S.sectionTitleClassName} id='event-discount-products-title'>
        행사 할인 상품
      </h2>

      <div aria-label='행사 할인 상품 카테고리' className={S.categoryListClassName}>
        <div
          ref={categoryMeasureRowRef}
          aria-hidden='true'
          className={S.categoryMeasurementRowClassName}
        >
          <PillButton platform='mobile' tabIndex={-1} variant='outlined-light'>
            전체
          </PillButton>
          {categories.map((category) => (
            <PillButton
              key={category.categoryId}
              platform='mobile'
              tabIndex={-1}
              variant='outlined-light'
            >
              {category.label}
            </PillButton>
          ))}
          <PillButton
            icon={<IcChevronDown />}
            platform='mobile'
            tabIndex={-1}
            variant='outlined-light'
          >
            더보기
          </PillButton>
        </div>

        <div ref={categoryPrimaryRowRef} className={S.categoryPrimaryRowClassName}>
          <PillButton
            aria-pressed={selectedCategoryId === EVENT_DISCOUNT_ALL_CATEGORY_ID}
            onClick={() => handleSelectCategory(EVENT_DISCOUNT_ALL_CATEGORY_ID)}
            platform='mobile'
            variant={
              selectedCategoryId === EVENT_DISCOUNT_ALL_CATEGORY_ID ? 'filled' : 'outlined-light'
            }
          >
            전체
          </PillButton>
          {defaultVisibleCategories.map((category) => (
            <PillButton
              key={category.categoryId}
              aria-pressed={selectedCategoryId === category.categoryId}
              onClick={() => handleSelectCategory(category.categoryId)}
              platform='mobile'
              variant={selectedCategoryId === category.categoryId ? 'filled' : 'outlined-light'}
            >
              {category.label}
            </PillButton>
          ))}
          {hasHiddenCategories && (
            <PillButton
              aria-expanded={isCategoryExpanded}
              icon={<MoreButtonIcon />}
              onClick={() => setIsCategoryExpanded((previousValue) => !previousValue)}
              platform='mobile'
              variant='outlined-light'
            >
              더보기
            </PillButton>
          )}
        </div>
        {hasExpandedCategories && (
          <div className={S.categoryExpandedGroupClassName}>
            {hiddenCategories.map((category) => (
              <PillButton
                key={category.categoryId}
                aria-pressed={selectedCategoryId === category.categoryId}
                onClick={() => handleSelectCategory(category.categoryId)}
                platform='mobile'
                variant={selectedCategoryId === category.categoryId ? 'filled' : 'outlined-light'}
              >
                {category.label}
              </PillButton>
            ))}
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <div className={S.eventProductGridClassName}>
          {products.map((product) => (
            <PeriodProductCard
              key={product.productId}
              className={S.eventProductCardClassName}
              href={CLIENT_ROUTES.marketProduct(marketId, String(product.productId))}
              imageSizes={EVENT_DISCOUNT_PRODUCT_IMAGE_SIZES}
              imageSrc={product.thumbnailUrl ?? undefined}
              priceText={formatPrice(product.discountedPrice)}
              productName={product.name}
            />
          ))}
        </div>
      ) : hasNextPage ? null : (
        <p className={S.emptyTextClassName}>해당 카테고리에 등록된 상품이 없어요.</p>
      )}
      {hasNextPage && (
        <div
          aria-hidden='true'
          className={S.eventDiscountLoadMoreSentinelClassName}
          ref={loadMoreSentinelRef}
        />
      )}
    </section>
  );
};
