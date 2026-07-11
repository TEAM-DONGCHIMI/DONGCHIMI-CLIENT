'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useToast } from '@dongchimi/shared/toast';
import { MartSummaryCard } from '@/shared/components';
import { CLIENT_ROUTES } from '@/shared/constants';
import { useIntersectionObserver } from '@/shared/hooks';
import { formatWon } from '@/shared/utils';

import { useNearbyMarketsMarketList } from '../NearbyMarketsClientProvider';
import * as S from '../NearbyMarketsPage.css';

const NEARBY_MARKETS_LOAD_ERROR_TOAST_ID = 'nearby-markets-load-error';
const NEARBY_MARKETS_LOAD_ERROR_MESSAGE = '마트를 불러올 수 없어요';

export const NearbyMarketsMarketListSection = () => {
  const {
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    keyword,
    markets,
  } = useNearbyMarketsMarketList();
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
      <section aria-label='주변 마트 목록' className={S.marketListSectionClassName}>
        <p className={S.marketListStatusClassName} role='status'>
          주변 마트를 불러오는 중이에요.
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label='주변 마트 목록' className={S.marketListSectionClassName}>
        <p className={S.marketListStatusClassName} role='alert'>
          {error?.message ?? '주변 마트를 불러오지 못했어요.'}
        </p>
      </section>
    );
  }

  if (markets.length === 0) {
    return (
      <section aria-label='주변 마트 목록' className={S.marketListSectionClassName}>
        <p className={S.marketListStatusClassName}>
          {keyword ? `'${keyword}'에 대한 검색 결과가 없어요.` : '주변에 등록된 마트가 없어요.'}
        </p>
      </section>
    );
  }

  return (
    <section aria-label='주변 마트 목록' className={S.marketListSectionClassName}>
      {markets.map((market) => (
        <MartSummaryCard
          key={market.marketId}
          discountCount={market.productCount}
          isOpen={market.isOpen}
          martName={market.name}
          onActionClick={() => router.push(CLIENT_ROUTES.market(String(market.marketId)))}
          products={market.previewProducts.map((product) => {
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
          마트를 더 불러오는 중이에요.
        </p>
      )}
    </section>
  );
};
