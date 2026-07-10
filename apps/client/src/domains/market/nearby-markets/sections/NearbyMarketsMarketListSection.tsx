'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useToast } from '@dongchimi/shared/toast';
import { MartSummaryCard } from '@/shared/components';
import { CLIENT_ROUTES } from '@/shared/constants';
import { useIntersectionObserver } from '@/shared/hooks';

import { useGetNearbyMarketsInfiniteQuery } from '../../hooks/use-nearby-markets-infinite-query';
import * as S from '../NearbyMarketsPage.css';
import { flattenNearbyMarketsPages } from '../utils/flatten-nearby-markets-pages';

const NEARBY_MARKETS_LOAD_ERROR_TOAST_ID = 'nearby-markets-load-error';
const NEARBY_MARKETS_LOAD_ERROR_MESSAGE = '위치 접근 허용에 실패했어요';

export interface NearbyMarketsMarketListSectionProps {
  keyword?: string;
  marketSearchOrigin?: { lat: number; lng: number };
}

export const NearbyMarketsMarketListSection = ({
  keyword,
  marketSearchOrigin,
}: NearbyMarketsMarketListSectionProps) => {
  const router = useRouter();
  const toast = useToast();

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isError, isPending } =
    useGetNearbyMarketsInfiniteQuery({
      keyword,
      lat: marketSearchOrigin?.lat,
      lng: marketSearchOrigin?.lng,
    });

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
          {error instanceof Error ? error.message : '주변 마트를 불러오지 못했어요.'}
        </p>
      </section>
    );
  }

  const markets = flattenNearbyMarketsPages(data);

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
