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
import { useDebouncedValue, useGeolocation } from '@/shared/hooks';

import { useGetNearbyMarketMarkersQuery } from '../hooks/use-nearby-market-markers-query';
import { useGetNearbyMarketsInfiniteQuery } from '../hooks/use-nearby-markets-infinite-query';
import type { NearbyMarketDtoTypes } from '../model/nearby-markets-schema';
import {
  DEFAULT_LOCATION_ADDRESS_TEXT,
  LOCATION_PERMISSION_DENIED_PLACEHOLDER,
} from './NearbyMarketsPage.constants';
import { useDaumPostcodeSearch } from './hooks/use-daum-postcode-search';
import { flattenNearbyMarketsPages } from './utils/flatten-nearby-markets-pages';

const LOCATION_PERMISSION_ERROR_TOAST_ID = 'nearby-markets-location-permission-error';
const POSTCODE_SEARCH_ERROR_TOAST_ID = 'nearby-markets-postcode-search-error';
const POSTCODE_SEARCH_ERROR_MESSAGE = '우편번호 검색을 불러오지 못했어요';
const LOCATION_PERMISSION_ERROR_MESSAGE = '위치 접근 허용에 실패했어요';

type MapCoordinatesTypes = Readonly<{ lat: number; lng: number }>;

type NearbyMarketsListQueryTypes = Pick<
  ReturnType<typeof useGetNearbyMarketsInfiniteQuery>,
  'error' | 'fetchNextPage' | 'hasNextPage' | 'isError' | 'isFetchingNextPage' | 'isPending'
>;

type NearbyMarketsClientContextValueTypes = Readonly<{
  map: {
    coordinates: MapCoordinatesTypes | null;
    errorCode: ReturnType<typeof useGeolocation>['errorCode'];
    isMarketsError: boolean;
    markets: NearbyMarketDtoTypes[];
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
  const markets = useMemo(() => flattenNearbyMarketsPages(data), [data]);

  useEffect(() => {
    if (errorCode === null) {
      return;
    }

    toast.error(LOCATION_PERMISSION_ERROR_MESSAGE, {
      id: LOCATION_PERMISSION_ERROR_TOAST_ID,
    });
  }, [errorCode, toast]);

  const handleKeywordChange = useCallback((value: string) => {
    setHasEditedKeyword(true);
    setKeyword(value);
  }, []);

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

  const mapValue = useMemo<NearbyMarketsClientContextValueTypes['map']>(
    () => ({
      coordinates,
      errorCode,
      isMarketsError: isMarkerMarketsError,
      markets: markerMarkets,
    }),
    [coordinates, errorCode, isMarkerMarketsError, markerMarkets],
  );

  const marketListValue = useMemo<NearbyMarketsClientContextValueTypes['marketList']>(
    () => ({
      error,
      fetchNextPage,
      hasNextPage,
      isError: isMarketsError,
      isFetchingNextPage,
      isPending: isMarketsPending,
      keyword: debouncedKeyword,
      markets,
    }),
    [
      debouncedKeyword,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isMarketsError,
      isMarketsPending,
      markets,
    ],
  );

  const searchValue = useMemo<NearbyMarketsClientContextValueTypes['search']>(
    () => ({
      keyword: displayValue,
      onKeywordClick: shouldOpenPostcodeSearch ? openPostcodeSearch : undefined,
      onKeywordChange: handleKeywordChange,
      placeholder: LOCATION_PERMISSION_DENIED_PLACEHOLDER,
      readOnly: shouldOpenPostcodeSearch,
    }),
    [displayValue, handleKeywordChange, openPostcodeSearch, shouldOpenPostcodeSearch],
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
