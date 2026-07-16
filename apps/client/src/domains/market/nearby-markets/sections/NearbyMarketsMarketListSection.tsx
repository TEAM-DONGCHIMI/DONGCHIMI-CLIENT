'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useToast } from '@dongchimi/shared/toast';
import emptyImage from '@/shared/assets/images/img_empty.svg';
import { MartSummaryCard } from '@/shared/components';
import { CLIENT_ROUTES } from '@/shared/constants';
import { useIntersectionObserver } from '@/shared/hooks';
import { formatWon } from '@/shared/utils';

import { useNearbyMarketsMarketList } from '../NearbyMarketsClientProvider';
import * as S from '../NearbyMarketsPage.css';

const NEARBY_MARKETS_LOAD_ERROR_TOAST_ID = 'nearby-markets-load-error';
const NEARBY_MARKETS_LIST_ARIA_LABEL = '주변 마트 목록';
const NEARBY_MARKETS_INITIAL_LOADING_MESSAGE = '주변 마트를 불러오는 중이에요.';
const NEARBY_MARKETS_LOADING_MESSAGE = '마트를 더 불러오는 중이에요.';
const NEARBY_MARKETS_LOAD_ERROR_MESSAGE = '마트를 불러올 수 없어요.';
const NEARBY_MARKETS_EMPTY_MESSAGE = '근처에 등록된 마트가 아직 없어요';
const NEARBY_MARKETS_SEARCH_EMPTY_MESSAGE = '검색 결과가 없어요';
const NEARBY_MARKETS_PREVIEW_PRODUCT_LIMIT = 3;

export const NearbyMarketsMarketListSection = () => {
  const { fetchNextPage, hasNextPage, isError, isFetchingNextPage, isPending, keyword, markets } =
    useNearbyMarketsMarketList();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isError) {
      return;
    }

    toast.error(NEARBY_MARKETS_LOAD_ERROR_MESSAGE, {
      id: NEARBY_MARKETS_LOAD_ERROR_TOAST_ID,
    });
  }, [isError, toast]);

  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  if (isPending) {
    return (
      <section aria-label={NEARBY_MARKETS_LIST_ARIA_LABEL} className={S.marketListSectionClassName}>
        <div className={S.marketListEmptyStateClassName} role='status'>
          <p className={S.marketListStatusClassName}>{NEARBY_MARKETS_INITIAL_LOADING_MESSAGE}</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label={NEARBY_MARKETS_LIST_ARIA_LABEL} className={S.marketListSectionClassName}>
        <div className={S.marketListEmptyStateClassName} role='alert'>
          <Image
            alt=''
            aria-hidden
            className={S.marketListEmptyImageClassName}
            height={91}
            src={emptyImage}
            width={91}
          />
          <p className={S.marketListEmptyTextClassName}>{NEARBY_MARKETS_LOAD_ERROR_MESSAGE}</p>
        </div>
      </section>
    );
  }

  if (markets.length === 0 && isFetchingNextPage) {
    return (
      <section aria-label={NEARBY_MARKETS_LIST_ARIA_LABEL} className={S.marketListSectionClassName}>
        <div className={S.marketListEmptyStateClassName} role='status'>
          <p className={S.marketListStatusClassName}>{NEARBY_MARKETS_LOADING_MESSAGE}</p>
        </div>
      </section>
    );
  }

  if (markets.length === 0) {
    const emptyMessage = keyword
      ? NEARBY_MARKETS_SEARCH_EMPTY_MESSAGE
      : NEARBY_MARKETS_EMPTY_MESSAGE;

    return (
      <section aria-label={NEARBY_MARKETS_LIST_ARIA_LABEL} className={S.marketListSectionClassName}>
        <div className={S.marketListEmptyStateClassName} role='status'>
          {!keyword && (
            <Image
              alt=''
              aria-hidden
              className={S.marketListEmptyImageClassName}
              height={91}
              src={emptyImage}
              width={91}
            />
          )}
          <p className={S.marketListEmptyTextClassName}>{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={NEARBY_MARKETS_LIST_ARIA_LABEL} className={S.marketListSectionClassName}>
      {markets.map((market) => (
        <MartSummaryCard
          key={market.marketId}
          discountCount={market.productCount}
          isOpen={market.isOpen}
          martName={market.name}
          onActionClick={() => router.push(CLIENT_ROUTES.market(market.slug))}
          products={market.previewProducts
            .slice(0, NEARBY_MARKETS_PREVIEW_PRODUCT_LIMIT)
            .map((product) => {
              const isDiscounted = product.discountRate > 0;

              return {
                hasSaleChip: isDiscounted,
                imageAlt: product.name,
                imageSrc: product.thumbnailUrl,
                price: formatWon(product.discountedPrice),
                productName: product.name,
                ...(isDiscounted ? { saleChipLabel: `${product.discountRate}%` } : {}),
              };
            })}
          profileImageAlt={market.name}
          profileImageSrc={market.thumbnailUrl}
        />
      ))}
      {hasNextPage && (
        <div ref={sentinelRef} aria-hidden className={S.marketListSentinelClassName} />
      )}
      {isFetchingNextPage && (
        <p className={S.marketListStatusClassName} role='status'>
          {NEARBY_MARKETS_LOADING_MESSAGE}
        </p>
      )}
    </section>
  );
};
