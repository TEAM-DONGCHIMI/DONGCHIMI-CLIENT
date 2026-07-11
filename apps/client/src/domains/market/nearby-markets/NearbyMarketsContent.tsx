'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@dongchimi/shared/toast';
import { MobileHeader } from '@/shared/components';
import { useDebouncedValue, useGeolocation } from '@/shared/hooks';

import { useGetNearbyMarketMarkersQuery } from '../hooks/use-nearby-market-markers-query';
import { useGetNearbyMarketsInfiniteQuery } from '../hooks/use-nearby-markets-infinite-query';
import {
  DEFAULT_LOCATION_ADDRESS_TEXT,
  LOCATION_PERMISSION_DENIED_PLACEHOLDER,
} from './NearbyMarketsPage.constants';
import { useDaumPostcodeSearch } from './hooks/use-daum-postcode-search';
import * as S from './NearbyMarketsPage.css';
import {
  NearbyMarketsMapSection,
  NearbyMarketsMarketListSection,
  NearbyMarketsSearchSection,
} from './sections';
import { flattenNearbyMarketsPages } from './utils/flatten-nearby-markets-pages';

const LOCATION_PERMISSION_ERROR_TOAST_ID = 'nearby-markets-location-permission-error';
const POSTCODE_SEARCH_ERROR_TOAST_ID = 'nearby-markets-postcode-search-error';
const POSTCODE_SEARCH_ERROR_MESSAGE = '우편번호 검색을 불러오지 못했어요';
const LOCATION_PERMISSION_ERROR_MESSAGE = '위치 접근 허용에 실패했어요';

export const NearbyMarketsContent = () => {
  const toast = useToast();
  const [keyword, setKeyword] = useState('');
  const [hasEditedKeyword, setHasEditedKeyword] = useState(false);
  const debouncedKeyword = useDebouncedValue(keyword);
  const { coordinates, errorCode } = useGeolocation();
  const shouldOpenPostcodeSearch = errorCode === 'PERMISSION_DENIED';
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

  const handlePostcodeSearchError = useCallback(() => {
    toast.error(POSTCODE_SEARCH_ERROR_MESSAGE, {
      id: POSTCODE_SEARCH_ERROR_TOAST_ID,
    });
  }, [toast]);

  const handleAdministrativeAddressSelect = useCallback((address: string) => {
    setHasEditedKeyword(true);
    setKeyword(address);
  }, []);

  const openPostcodeSearch = useDaumPostcodeSearch({
    enabled: shouldOpenPostcodeSearch,
    onError: handlePostcodeSearchError,
    onSelectAdministrativeAddress: handleAdministrativeAddressSelect,
  });

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
        onKeywordClick={shouldOpenPostcodeSearch ? openPostcodeSearch : undefined}
        onKeywordChange={handleKeywordChange}
        placeholder={LOCATION_PERMISSION_DENIED_PLACEHOLDER}
        readOnly={shouldOpenPostcodeSearch}
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
