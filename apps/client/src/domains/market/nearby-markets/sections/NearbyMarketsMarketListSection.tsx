'use client';

import { useRouter } from 'next/navigation';

import { MartSummaryCard } from '@/shared/components';
import { CLIENT_ROUTES } from '@/shared/constants';
import { useIntersectionObserver } from '@/shared/hooks';

import { useNearbyMarketsInfiniteQuery } from '../../hooks/use-nearby-markets-infinite-query';
import * as S from '../NearbyMarketsPage.css';
import { flattenNearbyMarketsPages } from '../utils/flatten-nearby-markets-pages';

export const NearbyMarketsMarketListSection = () => {
  const router = useRouter();

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isError, isPending } =
    useNearbyMarketsInfiniteQuery();

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
          {error instanceof Error ? error.message : '주변 마트를 불러오지 못했어요.'}
        </p>
      </section>
    );
  }

  const markets = flattenNearbyMarketsPages(data);

  if (markets.length === 0) {
    return (
      <section aria-label='주변 마트 목록' className={S.marketListSectionClassName}>
        <p className={S.marketListStatusClassName}>주변에 등록된 마트가 없어요.</p>
      </section>
    );
  }

  return (
    <section aria-label='주변 마트 목록' className={S.marketListSectionClassName}>
      {markets.map((market) => (
        <MartSummaryCard
          key={market.id}
          discountCount={market.discountCount}
          isOpen={market.isOpen}
          martName={market.martName}
          onActionClick={() => router.push(CLIENT_ROUTES.market(market.id))}
          products={market.products}
          profileImageAlt={market.profileImageAlt}
          profileImageSrc={market.profileImageSrc}
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
