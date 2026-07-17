'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useToast } from '@dongchimi/shared/toast';
import { type CoordinatesTypes, useDebouncedValue, useGeolocation } from '@/shared/hooks';

import { useGetNearbyMarketMarkersQuery } from '../hooks/use-nearby-market-markers-query';
import { useGetNearbyMarketsInfiniteQuery } from '../hooks/use-nearby-markets-infinite-query';
import type { NearbyMarketDtoTypes } from '../model/nearby-markets-schema';
import { useDaumPostcodeSearch } from './hooks/use-daum-postcode-search';
import {
  filterVisibleNearbyMarkets,
  getPrioritizedVisibleNearbyMarkets,
} from './utils/filter-visible-nearby-markets';
import { flattenNearbyMarketsPages } from './utils/flatten-nearby-markets-pages';
import { resolvePreferredCoordinates } from './utils/resolve-preferred-coordinates';

const LOCATION_PERMISSION_ERROR_TOAST_ID = 'nearby-markets-location-permission-error';
const POSTCODE_SEARCH_ERROR_TOAST_ID = 'nearby-markets-postcode-search-error';
const POSTCODE_SEARCH_ERROR_MESSAGE = '우편번호 검색을 불러올 수 없어요';
const LOCATION_PERMISSION_ERROR_MESSAGE = '위치 접근 허용에 실패했어요';
const LOCATION_SEARCH_PLACEHOLDER = '현재 위치를 검색해주세요'

type NearbyMarketsListQueryTypes = Pick<
  ReturnType<typeof useGetNearbyMarketsInfiniteQuery>,
  'error' | 'fetchNextPage' | 'hasNextPage' | 'isError' | 'isFetchingNextPage' | 'isPending'
>;

type NearbyMarketsClientContextValueTypes = Readonly<{
  map: {
    coordinates: CoordinatesTypes | null;
    errorCode: ReturnType<typeof useGeolocation>['errorCode'];
    isMarketsError: boolean;
    markets: NearbyMarketDtoTypes[];
    onCurrentLocationAddressChange: (address: string | null) => void;
    onSelectedCoordinatesChange: (coordinates: CoordinatesTypes | null) => void;
    selectedMapAddress: string | null;
  };
  marketList: NearbyMarketsListQueryTypes & {
    keyword?: string;
    markets: NearbyMarketDtoTypes[];
  };
  search: {
    keyword: string;
    onKeywordClick?: () => void;
    onKeywordChange: (keyword: string) => void;
    placeholder: string;
    readOnly: boolean;
  };
}>;

const NearbyMarketsClientContext = createContext<NearbyMarketsClientContextValueTypes | null>(null);

type NearbyMarketsClientProviderProps = Readonly<{
  children: ReactNode;
}>;

export const NearbyMarketsClientProvider = ({ children }: NearbyMarketsClientProviderProps) => {
  const toast = useToast();
  const [keyword, setKeyword] = useState('');
  const [selectedMapAddress, setSelectedMapAddress] = useState<string | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<CoordinatesTypes | null>(null);
  // 위치 권한이 허용됐을 때 현재 위치를 역geocoding한 주소 텍스트입니다. 검색 input 기본 표시값으로만 사용합니다.
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const debouncedKeyword = useDebouncedValue(keyword);
  const { coordinates, errorCode } = useGeolocation();
  const searchCoordinates = resolvePreferredCoordinates(selectedCoordinates, coordinates);
  const marketSearchKeyword = selectedMapAddress == null ? debouncedKeyword : undefined;
  const nearbyMarketsParams = {
    lat: searchCoordinates?.lat,
    lng: searchCoordinates?.lng,
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
  const markets = useMemo(() => flattenNearbyMarketsPages(data), [data]);
  const listMarkets = useMemo(() => getPrioritizedVisibleNearbyMarkets(markets), [markets]);
  const mapMarkets = useMemo(() => filterVisibleNearbyMarkets(markerMarkets), [markerMarkets]);

  useEffect(() => {
    if (errorCode === null) {
      return;
    }

    toast.error(LOCATION_PERMISSION_ERROR_MESSAGE, {
      id: LOCATION_PERMISSION_ERROR_TOAST_ID,
    });
  }, [errorCode, toast]);

  useEffect(() => {
    if (
      isMarketsPending ||
      isMarketsError ||
      isFetchingNextPage ||
      !hasNextPage ||
      markets.length === 0 ||
      listMarkets.length > 0
    ) {
      return;
    }

    void fetchNextPage();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isMarketsError,
    isMarketsPending,
    listMarkets.length,
    markets.length,
  ]);

  const handleKeywordChange = useCallback((value: string) => {
    setSelectedMapAddress(null);
    setSelectedCoordinates(null);
    setKeyword(value);
  }, []);

  const handlePostcodeSearchError = useCallback(
    (error: Error) => {
      void error;

      toast.error(POSTCODE_SEARCH_ERROR_MESSAGE, {
        id: POSTCODE_SEARCH_ERROR_TOAST_ID,
      });
    },
    [toast],
  );

  const handlePostcodeAddressSelect = useCallback(
    (address: { mapAddress: string; searchKeyword: string }) => {
      setSelectedMapAddress(address.mapAddress);
      setSelectedCoordinates(null);
      setKeyword(address.searchKeyword);
    },
    [],
  );

  // 위치 권한 허용 여부와 관계없이 항상 우편번호 검색 모달로 검색합니다.
  const openPostcodeSearch = useDaumPostcodeSearch({
    enabled: true,
    onError: handlePostcodeSearchError,
    onSelectAddress: handlePostcodeAddressSelect,
  });

  const mapValue = useMemo<NearbyMarketsClientContextValueTypes['map']>(
    () => ({
      coordinates,
      errorCode,
      isMarketsError: isMarkerMarketsError,
      markets: mapMarkets,
      onCurrentLocationAddressChange: setCurrentLocationAddress,
      onSelectedCoordinatesChange: setSelectedCoordinates,
      selectedMapAddress,
    }),
    [coordinates, errorCode, isMarkerMarketsError, mapMarkets, selectedMapAddress],
  );

  const marketListValue = useMemo<NearbyMarketsClientContextValueTypes['marketList']>(
    () => ({
      error,
      fetchNextPage,
      hasNextPage,
      isError: isMarketsError,
      isFetchingNextPage,
      isPending: isMarketsPending,
      keyword: marketSearchKeyword,
      markets: listMarkets,
    }),
    [
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isMarketsError,
      isMarketsPending,
      listMarkets,
      marketSearchKeyword,
    ],
  );

  // 우편번호 검색으로 고른 주소(keyword)가 있으면 그 텍스트를 우선하고,
  // 없을 때만 위치 권한이 허용된 경우의 현재 위치 주소 텍스트를 그대로 보여줍니다.
  const displayKeyword = keyword || currentLocationAddress || '';

  const searchValue = useMemo<NearbyMarketsClientContextValueTypes['search']>(
    () => ({
      keyword: displayKeyword,
      onKeywordClick: openPostcodeSearch,
      onKeywordChange: handleKeywordChange,
      placeholder: LOCATION_SEARCH_PLACEHOLDER,
      readOnly: true,
    }),
    [displayKeyword, handleKeywordChange, openPostcodeSearch],
  );

  const contextValue = useMemo<NearbyMarketsClientContextValueTypes>(
    () => ({ map: mapValue, marketList: marketListValue, search: searchValue }),
    [mapValue, marketListValue, searchValue],
  );

  return (
    <NearbyMarketsClientContext.Provider value={contextValue}>
      {children}
    </NearbyMarketsClientContext.Provider>
  );
};

const useNearbyMarketsClientContext = () => {
  const context = useContext(NearbyMarketsClientContext);

  if (context == null) {
    throw new Error(
      'NearbyMarkets client sections must be used within NearbyMarketsClientProvider',
    );
  }

  return context;
};

export const useNearbyMarketsSearch = () => useNearbyMarketsClientContext().search;

export const useNearbyMarketsMap = () => useNearbyMarketsClientContext().map;

export const useNearbyMarketsMarketList = () => useNearbyMarketsClientContext().marketList;
