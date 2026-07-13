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

type MapCoordinatesTypes = Readonly<{ lat: number; lng: number }>;
const LOCATION_PERMISSION_ERROR_MESSAGE = '위치 접근 허용에 실패했어요.';

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
    onSelectedCoordinatesChange: (coordinates: MapCoordinatesTypes | null) => void;
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
  // input에 직접 입력하거나 우편번호 검색 결과로 표시되는 값입니다.
  const [keyword, setKeyword] = useState('');
  // 기본 위치 문구를 보여줄지, 사용자가 값을 바꿨는지 구분합니다.
  const [hasEditedKeyword, setHasEditedKeyword] = useState(false);
  // Daum 검색 결과 중 Kakao geocoder에 넘길 도로명/지번 주소입니다.
  const [selectedMapAddress, setSelectedMapAddress] = useState<string | null>(null);
  // selectedMapAddress를 Kakao geocoder로 변환한 좌표입니다.
  const [selectedCoordinates, setSelectedCoordinates] = useState<MapCoordinatesTypes | null>(null);
  // 사용자가 직접 입력한 검색어만 debounce해서 목록 keyword 검색에 사용합니다.
  const debouncedKeyword = useDebouncedValue(keyword);
  // 브라우저 현재 위치와 권한 거부 상태를 가져옵니다.
  const { coordinates, errorCode } = useGeolocation();
  // 위치 권한이 거부된 경우 input 클릭을 우편번호 검색 트리거로 바꿉니다.
  const shouldOpenPostcodeSearch = errorCode === 'PERMISSION_DENIED';
  // 주소 검색 좌표가 있으면 현재 위치보다 우선해서 주변 마트 조회 기준으로 사용합니다.
  const searchCoordinates = selectedCoordinates ?? coordinates;
  // 주소 검색 결과는 input 표시값일 뿐, 마트명/주소 keyword 필터에는 넣지 않습니다.
  const marketSearchKeyword = selectedMapAddress == null ? debouncedKeyword : undefined;
  // 목록과 지도 마커가 같은 검색어/좌표 기준으로 조회되도록 query params를 공유합니다.
  const nearbyMarketsParams = {
    keyword: marketSearchKeyword,
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

  useEffect(() => {
    if (errorCode === null) {
      return;
    }

    toast.error(LOCATION_PERMISSION_ERROR_MESSAGE, {
      id: LOCATION_PERMISSION_ERROR_TOAST_ID,
    });
  }, [errorCode, toast]);

  // 사용자가 직접 입력하면 주소 검색 모드를 해제하고 일반 keyword 검색으로 돌아갑니다.
  const handleKeywordChange = useCallback((value: string) => {
    setHasEditedKeyword(true);
    setSelectedMapAddress(null);
    setSelectedCoordinates(null);
    setKeyword(value);
  }, []);

  // Daum script 또는 팝업 실행 실패를 사용자가 알 수 있게 toast로 노출합니다.
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
      setHasEditedKeyword(true);
      // Kakao geocoder가 좌표로 바꿀 주소를 먼저 저장합니다.
      setSelectedMapAddress(address.mapAddress);
      // 새 주소가 선택됐으므로 이전 좌표는 비우고 변환 결과를 기다립니다.
      setSelectedCoordinates(null);
      // input에는 "00시 00구 00동" 형태의 행정동 검색어를 표시합니다.
      setKeyword(address.searchKeyword);
    },
    [],
  );

  const openPostcodeSearch = useDaumPostcodeSearch({
    enabled: shouldOpenPostcodeSearch,
    onError: handlePostcodeSearchError,
    onSelectAddress: handlePostcodeAddressSelect,
  });

  // 사용자가 아직 건드리지 않았고 현재 위치가 있으면 기본 위치 문구를 보여줍니다.
  const displayValue =
    !hasEditedKeyword && coordinates != null ? DEFAULT_LOCATION_ADDRESS_TEXT : keyword;

  const mapValue = useMemo<NearbyMarketsClientContextValueTypes['map']>(
    () => ({
      coordinates,
      errorCode,
      isMarketsError: isMarkerMarketsError,
      markets: markerMarkets,
      onSelectedCoordinatesChange: setSelectedCoordinates,
      selectedMapAddress,
    }),
    [coordinates, errorCode, isMarkerMarketsError, markerMarkets, selectedMapAddress],
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
      markets,
    }),
    [
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isMarketsError,
      isMarketsPending,
      marketSearchKeyword,
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
