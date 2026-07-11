import { useEffect, useRef } from 'react';

import { PillButton } from '@dongchimi/design-system';
import { IcChevronDown, IcChevronUp } from '@dongchimi/design-system/icons';
import { PeriodProductCard } from '@/shared/components/ui/period-product-card';
import { CLIENT_ROUTES } from '@/shared/constants';

import { useEventDiscountCategoryLayout } from '../hooks/useEventDiscountCategoryLayout';
import type {
  EventDiscountCategoryFixtureTypes,
  EventDiscountProductFixtureTypes,
} from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';
import { formatPrice } from '../utils/format-price';

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
  const loadMoreSentinelRef = useEventDiscountInfiniteScroll({
    hasNextPage,
    nextCursor,
    onLoadNextPage,
  });
  const { categoryListRef, categoryMeasureRowRef, firstRowCategoryCount } =
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

        <div className={S.categoryPrimaryRowClassName}>
          <PillButton
            aria-pressed={selectedCategoryId === EVENT_DISCOUNT_ALL_CATEGORY_ID}
            onClick={() => onSelectCategory(EVENT_DISCOUNT_ALL_CATEGORY_ID)}
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
              onClick={() => onSelectCategory(category.categoryId)}
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
              onClick={onToggleCategoryExpanded}
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
                onClick={() => onSelectCategory(category.categoryId)}
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
