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
import { flattenNearbyMarketsPages } from './utils/flatten-nearby-markets-pages';

const LOCATION_PERMISSION_ERROR_TOAST_ID = 'nearby-markets-location-permission-error';
const LOCATION_PERMISSION_ERROR_MESSAGE = '위치 접근 허용에 실패했어요.';

type NearbyMarketsListQueryTypes = Pick<
  ReturnType<typeof useGetNearbyMarketsInfiniteQuery>,
  'error' | 'fetchNextPage' | 'hasNextPage' | 'isError' | 'isFetchingNextPage' | 'isPending'
>;

type NearbyMarketsClientContextValueTypes = Readonly<{
  map: {
    coordinates: { lat: number; lng: number } | null;
    errorCode: ReturnType<typeof useGeolocation>['errorCode'];
    isMarketsError: boolean;
    markets: NearbyMarketDtoTypes[];
  };
  marketList: NearbyMarketsListQueryTypes & {
    keyword: string;
    markets: NearbyMarketDtoTypes[];
  };
  search: {
    keyword: string;
    onKeywordChange: (keyword: string) => void;
    placeholder: string;
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

  const handleKeywordChange = useCallback((value: string) => {
    setHasEditedKeyword(true);
    setKeyword(value);
  }, []);

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
      onKeywordChange: handleKeywordChange,
      placeholder: LOCATION_PERMISSION_DENIED_PLACEHOLDER,
    }),
    [displayValue, handleKeywordChange],
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
