import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { IcChevronDown, IcChevronUp } from '@dongchimi/design-system/icons';
import { PeriodProductCard } from '@/shared/components/ui/period-product-card';
import { CLIENT_ROUTES } from '@/shared/constants';

import type {
  EventDiscountCategoryFixtureTypes,
  EventDiscountProductFixtureTypes,
} from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';

interface EventDiscountProductsSectionProps {
  categories: EventDiscountCategoryFixtureTypes[];
  hasNextPage: boolean;
  isCategoryExpanded: boolean;
  marketId: string;
  nextCursor: number | null;
  onLoadNextPage: () => void;
  onSelectCategory: (categoryId: string) => void;
  onToggleCategoryExpanded: () => void;
  products: EventDiscountProductFixtureTypes[];
  selectedCategoryId: string;
  visibleCategoryCount: number;
}

export const EVENT_DISCOUNT_ALL_CATEGORY_ID = 'all';

const EVENT_DISCOUNT_PRODUCT_IMAGE_SIZES = 'calc((100vw - 10rem) / 3)';

const formatPrice = (price: number) => price.toLocaleString('ko-KR');

type CategoryRowMeasurementTypes = Readonly<{
  allCategoryWidth: number;
  categoryWidths: readonly number[];
  containerWidth: number;
  gap: number;
  moreCategoryWidth: number;
}>;

export const calculateFirstRowCategoryCount = ({
  allCategoryWidth,
  categoryWidths,
  containerWidth,
  gap,
  moreCategoryWidth,
}: CategoryRowMeasurementTypes) => {
  const fullCategoryRowWidth = categoryWidths.reduce((totalWidth, categoryWidth) => {
    return totalWidth + gap + categoryWidth;
  }, allCategoryWidth);

  if (fullCategoryRowWidth <= containerWidth) {
    return categoryWidths.length;
  }

  let occupiedWidth = allCategoryWidth + gap + moreCategoryWidth;
  let nextCategoryCount = 0;

  for (const categoryWidth of categoryWidths) {
    const nextWidth = occupiedWidth + gap + categoryWidth;

    if (nextWidth > containerWidth) {
      break;
    }

    occupiedWidth = nextWidth;
    nextCategoryCount += 1;
  }

  return nextCategoryCount;
};

const getFlexGapPx = (element: HTMLElement) => {
  const gap = window.getComputedStyle(element).columnGap;
  const parsedGap = Number.parseFloat(gap);

  return Number.isFinite(parsedGap) ? parsedGap : 0;
};

const EVENT_DISCOUNT_PRELOAD_ROOT_MARGIN = '0px 0px 240px';

const useEventDiscountInfiniteScroll = ({
  hasNextPage,
  nextCursor,
  onLoadNextPage,
}: Pick<EventDiscountProductsSectionProps, 'hasNextPage' | 'nextCursor' | 'onLoadNextPage'>) => {
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
  categories,
  hasNextPage,
  isCategoryExpanded,
  marketId,
  nextCursor,
  onLoadNextPage,
  onSelectCategory,
  onToggleCategoryExpanded,
  products,
  selectedCategoryId,
  visibleCategoryCount,
}: EventDiscountProductsSectionProps) => {
  const categoryListRef = useRef<HTMLDivElement>(null);
  const categoryMeasureRowRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useEventDiscountInfiniteScroll({
    hasNextPage,
    nextCursor,
    onLoadNextPage,
  });
  const [firstRowCategoryCount, setFirstRowCategoryCount] = useState(visibleCategoryCount);
  const categoryLayoutSignature = categories
    .map((category) => `${category.categoryId}:${category.label}`)
    .join('|');

  const updateFirstRowCategoryCount = useCallback(() => {
    const categoryListElement = categoryListRef.current;
    const measureRowElement = categoryMeasureRowRef.current;

    if (categoryListElement == null || measureRowElement == null) {
      return;
    }

    const containerWidth = categoryListElement.clientWidth;

    if (containerWidth <= 0) {
      setFirstRowCategoryCount(visibleCategoryCount);
      return;
    }

    const measuredItems = Array.from(measureRowElement.children) as HTMLElement[];
    const allCategoryElement = measuredItems[0];
    const moreCategoryElement = measuredItems[measuredItems.length - 1];

    if (allCategoryElement == null || moreCategoryElement == null) {
      return;
    }

    const gap = getFlexGapPx(measureRowElement);
    const categoryItemElements = measuredItems.slice(1, -1);
    const nextCategoryCount = calculateFirstRowCategoryCount({
      allCategoryWidth: allCategoryElement.getBoundingClientRect().width,
      categoryWidths: categoryItemElements.map((categoryItemElement) => {
        return categoryItemElement.getBoundingClientRect().width;
      }),
      containerWidth,
      gap,
      moreCategoryWidth: moreCategoryElement.getBoundingClientRect().width,
    });

    setFirstRowCategoryCount((currentCount) => {
      return currentCount === nextCategoryCount ? currentCount : nextCategoryCount;
    });
  }, [visibleCategoryCount]);

  useLayoutEffect(() => {
    updateFirstRowCategoryCount();
  }, [categoryLayoutSignature, updateFirstRowCategoryCount]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || categoryListRef.current == null) {
      window.addEventListener('resize', updateFirstRowCategoryCount);

      return () => {
        window.removeEventListener('resize', updateFirstRowCategoryCount);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateFirstRowCategoryCount();
    });

    resizeObserver.observe(categoryListRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateFirstRowCategoryCount]);

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

      <div
        ref={categoryListRef}
        aria-label='행사 할인 상품 카테고리'
        className={S.categoryListClassName}
      >
        <div
          ref={categoryMeasureRowRef}
          aria-hidden='true'
          className={S.categoryMeasurementRowClassName}
        >
          <span className={S.categoryButtonClassName}>전체</span>
          {categories.map((category) => (
            <span key={category.categoryId} className={S.categoryButtonClassName}>
              {category.label}
            </span>
          ))}
          <span className={S.moreCategoryButtonClassName}>
            더보기
            <MoreButtonIcon aria-hidden='true' />
          </span>
        </div>

        <div className={S.categoryPrimaryRowClassName}>
          <button
            aria-pressed={selectedCategoryId === EVENT_DISCOUNT_ALL_CATEGORY_ID}
            className={S.categoryButtonClassName}
            onClick={() => onSelectCategory(EVENT_DISCOUNT_ALL_CATEGORY_ID)}
            type='button'
          >
            전체
          </button>
          {defaultVisibleCategories.map((category) => (
            <button
              key={category.categoryId}
              aria-pressed={selectedCategoryId === category.categoryId}
              className={S.categoryButtonClassName}
              onClick={() => onSelectCategory(category.categoryId)}
              type='button'
            >
              {category.label}
            </button>
          ))}
          {hasHiddenCategories && (
            <button
              aria-expanded={isCategoryExpanded}
              className={S.moreCategoryButtonClassName}
              onClick={onToggleCategoryExpanded}
              type='button'
            >
              더보기
              <MoreButtonIcon aria-hidden='true' />
            </button>
          )}
        </div>
        {hasExpandedCategories && (
          <div className={S.categoryExpandedGroupClassName}>
            {hiddenCategories.map((category) => (
              <button
                key={category.categoryId}
                aria-pressed={selectedCategoryId === category.categoryId}
                className={S.categoryButtonClassName}
                onClick={() => onSelectCategory(category.categoryId)}
                type='button'
              >
                {category.label}
              </button>
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
      ) : (
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
