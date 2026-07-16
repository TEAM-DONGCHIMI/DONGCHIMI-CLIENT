'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { Button, PillButton } from '@dongchimi/design-system';
import { IcChevronDown, IcChevronUp } from '@dongchimi/design-system/icons';

import { usePeriodicProductsInfiniteQuery } from '@/domains/market/hooks/use-periodic-products-infinite-query';
import type {
  PeriodicProductCategoryTypes,
  PeriodicProductsPageTypes,
} from '@/domains/market/model/periodic-products-schema';
import { PeriodProductCard } from '@/shared/components/ui/period-product-card';
import { CLIENT_ROUTES } from '@/shared/constants';
import { useIntersectionObserver } from '@/shared/hooks';

import {
  getMarketProductAnchorId,
  isPrimaryProductLinkClick,
  saveMarketProductsScrollRestoration,
  type EventDiscountScrollRestorationTypes,
} from '../hooks/market-products-scroll-restoration';
import { useEventDiscountCategoryLayout } from '../hooks/useEventDiscountCategoryLayout';
import * as S from '../MarketProductsPage.css';
import { formatPrice } from '../utils/format-price';

interface EventDiscountProductsSectionProps {
  marketId: number;
  marketSlug: string;
  restorationState?: EventDiscountScrollRestorationTypes;
  visibleCategoryCount: number;
}

interface EventDiscountCategoryTypes {
  apiCategory: PeriodicProductCategoryTypes;
  categoryId: string;
  label: string;
}

interface AvailableCategorySnapshotTypes {
  marketId: number;
  values: PeriodicProductCategoryTypes[];
}

export const EVENT_DISCOUNT_ALL_CATEGORY_ID = 'all';

const EVENT_DISCOUNT_PRODUCT_IMAGE_SIZES = 'calc((100vw - 10rem) / 3)';
const EVENT_DISCOUNT_PRELOAD_ROOT_MARGIN = '0px 0px 240px';

const EVENT_DISCOUNT_CATEGORIES = [
  { apiCategory: 'VEGETABLE_FRUIT', categoryId: 'vegetable-fruit', label: '채소·과일' },
  { apiCategory: 'MEAT_EGG', categoryId: 'meat-egg', label: '정육·달걀' },
  { apiCategory: 'SEAFOOD', categoryId: 'seafood', label: '수산물' },
  { apiCategory: 'DAIRY', categoryId: 'dairy', label: '유제품' },
  { apiCategory: 'CONVENIENCE_FOOD', categoryId: 'convenience-food', label: '간편식' },
  { apiCategory: 'PROCESSED_FOOD', categoryId: 'processed-food', label: '가공식품' },
  { apiCategory: 'BEVERAGE_ALCOHOL', categoryId: 'beverage-alcohol', label: '음료·주류' },
  { apiCategory: 'HOUSEHOLD_GOODS', categoryId: 'household-goods', label: '생활용품' },
  { apiCategory: 'ETC', categoryId: 'etc', label: '기타' },
] satisfies EventDiscountCategoryTypes[];

const resolveEventDiscountCategoryId = (categoryId?: string) => {
  if (
    categoryId != null &&
    EVENT_DISCOUNT_CATEGORIES.some((category) => category.categoryId === categoryId)
  ) {
    return categoryId;
  }

  return EVENT_DISCOUNT_ALL_CATEGORY_ID;
};

interface EventDiscountProductsContentProps {
  hasNextPage: boolean;
  isCategoryExpanded: boolean;
  isError: boolean;
  isFetchNextPageError: boolean;
  isPending: boolean;
  marketSlug: string;
  onRetry: () => void;
  pageParams: (number | undefined)[];
  productPages: PeriodicProductsPageTypes[];
  selectedCategoryId: string;
}

interface EventDiscountProductPageProps {
  isCategoryExpanded: boolean;
  marketSlug: string;
  page: PeriodicProductsPageTypes;
  selectedCategoryId: string;
}

const EventDiscountProductPage = memo(function EventDiscountProductPage({
  isCategoryExpanded,
  marketSlug,
  page,
  selectedCategoryId,
}: EventDiscountProductPageProps) {
  return (
    <div className={S.eventProductGridClassName}>
      {page.content.map((product) => (
        <PeriodProductCard
          key={product.productId}
          className={S.eventProductCardClassName}
          href={CLIENT_ROUTES.marketProduct(marketSlug, String(product.productId))}
          id={getMarketProductAnchorId('event-discount', product.productId)}
          imageSizes={EVENT_DISCOUNT_PRODUCT_IMAGE_SIZES}
          imageSrc={product.thumbnailUrl ?? undefined}
          onClick={(event) => {
            if (!isPrimaryProductLinkClick(event)) {
              return;
            }

            saveMarketProductsScrollRestoration({
              anchorId: event.currentTarget.id,
              isCategoryExpanded,
              marketSlug,
              productId: String(product.productId),
              scrollY: window.scrollY,
              section: 'event-discount',
              selectedCategoryId,
              viewportTop: event.currentTarget.getBoundingClientRect().top,
            });
          }}
          prefetch={false}
          priceText={formatPrice(product.discountedPrice)}
          productName={product.name}
        />
      ))}
    </div>
  );
});

const EventDiscountProductsContent = ({
  hasNextPage,
  isCategoryExpanded,
  isError,
  isFetchNextPageError,
  isPending,
  marketSlug,
  onRetry,
  pageParams,
  productPages,
  selectedCategoryId,
}: EventDiscountProductsContentProps) => {
  const hasProducts = productPages.some((page) => page.content.length > 0);

  if (isPending) {
    return (
      <p className={S.emptyTextClassName} role='status'>
        행사 상품을 불러오는 중이에요.
      </p>
    );
  }

  if (isError && !isFetchNextPageError && !hasProducts) {
    return (
      <div className={S.eventDiscountStateClassName}>
        <p className={S.emptyTextClassName} role='alert'>
          행사 상품을 불러오지 못했어요.
        </p>
        <Button onClick={onRetry} size='mobile'>
          다시 시도
        </Button>
      </div>
    );
  }

  if (!hasProducts && hasNextPage) {
    return (
      <p className={S.emptyTextClassName} role='status'>
        행사 상품을 더 찾고 있어요.
      </p>
    );
  }

  if (!hasProducts) {
    return <p className={S.emptyTextClassName}>해당 카테고리에 등록된 상품이 없어요.</p>;
  }

  return (
    <div className={S.eventProductPagesClassName}>
      {productPages.map((page, pageIndex) => {
        if (page.content.length === 0) {
          return null;
        }

        const pageKey = pageParams[pageIndex] ?? 'initial';

        return (
          <EventDiscountProductPage
            key={pageKey}
            isCategoryExpanded={isCategoryExpanded}
            marketSlug={marketSlug}
            page={page}
            selectedCategoryId={selectedCategoryId}
          />
        );
      })}
    </div>
  );
};

export const EventDiscountProductsSection = ({
  marketId,
  marketSlug,
  restorationState,
  visibleCategoryCount,
}: EventDiscountProductsSectionProps) => {
  const restoredCategoryId = resolveEventDiscountCategoryId(restorationState?.selectedCategoryId);
  const appliedRestorationIdRef = useRef(restorationState?.restorationId);
  const [availableCategorySnapshot, setAvailableCategorySnapshot] =
    useState<AvailableCategorySnapshotTypes | null>(null);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(
    restorationState?.isCategoryExpanded ?? false,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(restoredCategoryId);
  const selectedCategory = EVENT_DISCOUNT_CATEGORIES.find(
    (category) => category.categoryId === selectedCategoryId,
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    isPending,
    refetch,
  } = usePeriodicProductsInfiniteQuery({
    category: selectedCategory?.apiCategory,
    marketId,
  });
  const pageParams = data?.pageParams ?? [];
  const productPages = data?.pages ?? [];
  const responseAvailableCategories = productPages[0]?.availableCategories;
  const snapshotAvailableCategories =
    availableCategorySnapshot?.marketId === marketId ? availableCategorySnapshot.values : [];
  const availableCategorySet = new Set(responseAvailableCategories ?? snapshotAvailableCategories);
  const availableCategories = EVENT_DISCOUNT_CATEGORIES.filter((category) => {
    return (
      availableCategorySet.has(category.apiCategory) || category.categoryId === selectedCategoryId
    );
  });

  useEffect(() => {
    if (
      restorationState == null ||
      restorationState.restorationId === appliedRestorationIdRef.current
    ) {
      return;
    }

    appliedRestorationIdRef.current = restorationState.restorationId;
    setIsCategoryExpanded(restorationState.isCategoryExpanded);
    setSelectedCategoryId(resolveEventDiscountCategoryId(restorationState.selectedCategoryId));
  }, [restorationState]);

  const handleSelectCategory = (categoryId: string) => {
    if (categoryId === selectedCategoryId) {
      return;
    }

    if (responseAvailableCategories != null) {
      setAvailableCategorySnapshot({
        marketId,
        values: responseAvailableCategories,
      });
    }

    setSelectedCategoryId(categoryId);
  };
  const handleLoadNextPage = () => {
    void fetchNextPage({ cancelRefetch: false });
  };
  const loadMoreSentinelRef = useIntersectionObserver<HTMLDivElement>({
    enabled: Boolean(hasNextPage) && !isFetchingNextPage && !isFetchNextPageError,
    onIntersect: handleLoadNextPage,
    rootMargin: EVENT_DISCOUNT_PRELOAD_ROOT_MARGIN,
  });
  const { categoryMeasureRowRef, categoryPrimaryRowRef, firstRowCategoryCount } =
    useEventDiscountCategoryLayout({
      categories: availableCategories,
      visibleCategoryCount,
    });

  const defaultVisibleCategories = availableCategories.slice(0, firstRowCategoryCount);
  const hiddenCategories = availableCategories.slice(firstRowCategoryCount);
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
          {availableCategories.map((category) => (
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

      <EventDiscountProductsContent
        hasNextPage={Boolean(hasNextPage)}
        isCategoryExpanded={isCategoryExpanded}
        isError={isError}
        isFetchNextPageError={isFetchNextPageError}
        isPending={isPending}
        marketSlug={marketSlug}
        onRetry={() => void refetch()}
        pageParams={pageParams}
        productPages={productPages}
        selectedCategoryId={selectedCategoryId}
      />

      {hasNextPage && !isFetchNextPageError && (
        <div
          ref={loadMoreSentinelRef}
          aria-hidden='true'
          className={S.eventDiscountLoadMoreSentinelClassName}
        />
      )}
      {isFetchingNextPage && (
        <p className={S.emptyTextClassName} role='status'>
          상품을 더 불러오는 중입니다.
        </p>
      )}
      {isFetchNextPageError && (
        <div className={S.eventDiscountStateClassName}>
          <p className={S.emptyTextClassName} role='alert'>
            상품을 더 불러오지 못했어요.
          </p>
          <Button onClick={handleLoadNextPage} size='mobile'>
            다시 시도
          </Button>
        </div>
      )}
    </section>
  );
};
