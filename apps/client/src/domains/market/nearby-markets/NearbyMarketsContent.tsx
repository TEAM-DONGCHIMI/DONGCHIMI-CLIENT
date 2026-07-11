'use client';

import { useEffect, useState } from 'react';

import { useToast } from '@dongchimi/shared/toast';
import { MobileHeader } from '@/shared/components';
import { useDebouncedValue, useGeolocation } from '@/shared/hooks';

import { useGetNearbyMarketMarkersQuery } from '../hooks/use-nearby-market-markers-query';
import { useGetNearbyMarketsInfiniteQuery } from '../hooks/use-nearby-markets-infinite-query';
import {
  DEFAULT_LOCATION_ADDRESS_TEXT,
  LOCATION_PERMISSION_DENIED_PLACEHOLDER,
} from './NearbyMarketsPage.constants';
import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';
import { flattenNearbyMarketsPages } from './utils/flatten-nearby-markets-pages';

const LOCATION_PERMISSION_ERROR_TOAST_ID = 'nearby-markets-location-permission-error';
const LOCATION_PERMISSION_ERROR_MESSAGE = '위치 접근 허용에 실패했어요';

export const NearbyMarketsContent = () => {
  const toast = useToast();
  const [keyword, setKeyword] = useState('');
  const [hasEditedKeyword, setHasEditedKeyword] = useState(false);
  const debouncedKeyword = useDebouncedValue(keyword);
  const { coordinates, errorCode } = useGeolocation();
  const nearbyMarketsParams = {
    keyword: debouncedKeyword,
    lat: coordinates?.lat,
    lng: coordinates?.lng,
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError: isMarketsError,
    isFetchingNextPage,
    isPending: isMarketsPending,
  } = useGetNearbyMarketsInfiniteQuery(nearbyMarketsParams);
  const { data: markerMarkets = [], isError: isMarkerMarketsError } =
    useGetNearbyMarketMarkersQuery(nearbyMarketsParams);
  const markets = flattenNearbyMarketsPages(data);

  useEffect(() => {
    if (errorCode === null) {
      return;
    }

    toast.error(LOCATION_PERMISSION_ERROR_MESSAGE, {
      id: LOCATION_PERMISSION_ERROR_TOAST_ID,
    });
  }, [errorCode, toast]);

  const handleKeywordChange = (value: string) => {
    setHasEditedKeyword(true);
    setKeyword(value);
  };

  const displayValue =
    !hasEditedKeyword && coordinates != null ? DEFAULT_LOCATION_ADDRESS_TEXT : keyword;

  return (
    <main className={S.pageClassName}>
      <MobileHeader aria-label='앱 헤더'>
        <MobileHeader.Logo>
          <div aria-label='로고' className={S.logoPlaceholderClassName} role='img' />
        </MobileHeader.Logo>
      </MobileHeader>

      <NearbyMarketsSearchSection
        keyword={displayValue}
        onKeywordChange={handleKeywordChange}
        placeholder={LOCATION_PERMISSION_DENIED_PLACEHOLDER}
      />
      <NearbyMarketsMapSection
        coordinates={coordinates}
        errorCode={errorCode}
        isMarketsError={isMarkerMarketsError}
        markets={markerMarkets}
      />
      <NearbyMarketsMarketListSection
        error={error}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isError={isMarketsError}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isMarketsPending}
        keyword={debouncedKeyword}
        markets={markets}
      />
    </main>
  );
};
