'use client';

import { useState } from 'react';

import { Map, MapInfoWindow, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

import type { GeolocationErrorCodeTypes } from '@/shared/hooks';

import { useNearbyMarketsMap } from '../NearbyMarketsClientProvider';
import * as S from '../NearbyMarketsPage.css';
import { useKakaoAddressGeocoder } from '../hooks/use-kakao-address-geocoder';
import {
  ADDRESS_SEARCH_ERROR_MESSAGE,
  CURRENT_LOCATION_ARIA_LABEL,
  CURRENT_LOCATION_MARKER_IMAGE,
  DEFAULT_CENTER,
  KAKAO_MAP_APP_KEY,
  LOAD_ERROR_MESSAGE,
  MARKET_MARKER_IMAGE,
  MAP_LOADING_MESSAGE,
  MAP_SECTION_ARIA_LABEL,
  MAP_ZOOM_LEVEL,
  PERMISSION_DENIED_MESSAGE,
  SELECTED_LOCATION_ARIA_LABEL,
  SELECTED_LOCATION_MARKER_IMAGE,
} from './NearbyMarketsMapSection.constants';

const resolveStatusMessage = (
  errorCode: GeolocationErrorCodeTypes | null,
  isMarketsError: boolean,
): string | null => {
  if (errorCode === 'PERMISSION_DENIED') {
    return PERMISSION_DENIED_MESSAGE;
  }

  if (errorCode || isMarketsError) {
    return LOAD_ERROR_MESSAGE;
  }

  return null;
};

export const NearbyMarketsMapSection = () => {
  // provider에서 현재 위치, 검색 주소, 주변 마트 마커 상태를 읽습니다.
  const {
    coordinates,
    errorCode,
    isMarketsError,
    markets,
    onSelectedCoordinatesChange,
    selectedMapAddress,
  } = useNearbyMarketsMap();
  // 주소 좌표 변환을 위해 Kakao services 라이브러리까지 함께 로드합니다.
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_APP_KEY ?? '',
    libraries: ['services'],
  });
  // selectedMapAddress를 지도 중심/조회 기준 좌표로 변환합니다.
  const { coordinates: selectedCoordinates, isError: isAddressSearchError } =
    useKakaoAddressGeocoder({
      address: selectedMapAddress,
      onCoordinatesChange: onSelectedCoordinatesChange,
      ready: !loading && !error,
    });

  // 선택된 마트 핀의 정보창을 열기 위한 상태입니다.
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null);

  if (loading) {
    return (
      <section aria-label={MAP_SECTION_ARIA_LABEL} className={S.mapSectionClassName}>
        <div aria-label={MAP_LOADING_MESSAGE} className={S.mapAreaClassName} role='img' />
      </section>
    );
  }

  if (!KAKAO_MAP_APP_KEY || error) {
    return (
      <section aria-label={MAP_SECTION_ARIA_LABEL} className={S.mapSectionClassName}>
        <div aria-label={LOAD_ERROR_MESSAGE} className={S.mapAreaClassName} role='img' />
        <p className={S.mapStatusClassName} role='status'>
          {LOAD_ERROR_MESSAGE}
        </p>
      </section>
    );
  }

  // 선택된 마트 id와 실제 마트 데이터를 연결해 정보창 위치/이름을 만듭니다.
  const selectedMarket = markets.find((market) => market.marketId === selectedMarketId) ?? null;
  const statusMessage = resolveStatusMessage(errorCode, isMarketsError);
  // 주소 검색 좌표가 있으면 지도 중심은 검색 위치를 우선하고, 없을 때만 현위치를 사용합니다.
  const center = selectedCoordinates ?? coordinates ?? DEFAULT_CENTER;

  return (
    <section aria-label={MAP_SECTION_ARIA_LABEL} className={S.mapSectionClassName}>
      <Map
        center={center}
        className={S.mapAreaClassName}
        level={MAP_ZOOM_LEVEL}
        onClick={() => setSelectedMarketId(null)}
      >
        {/* 검색 주소 위치 마커입니다. */}
        {selectedCoordinates && (
          <MapMarker
            image={SELECTED_LOCATION_MARKER_IMAGE}
            position={selectedCoordinates}
            title={SELECTED_LOCATION_ARIA_LABEL}
          />
        )}
        {/* 현재 위치 마커입니다. 검색 주소 마커와 다른 이미지를 사용합니다. */}
        {coordinates && (
          <MapMarker
            image={CURRENT_LOCATION_MARKER_IMAGE}
            position={coordinates}
            title={CURRENT_LOCATION_ARIA_LABEL}
          />
        )}

        {/* 주변 마트 마커입니다. 현재 위치/검색 위치 마커와 다른 이미지를 사용합니다. */}
        {markets.map((market) => (
          <MapMarker
            key={market.marketId}
            image={MARKET_MARKER_IMAGE}
            position={{ lat: market.latitude, lng: market.longitude }}
            title={market.name}
            onClick={() =>
              setSelectedMarketId((current) =>
                current === market.marketId ? null : market.marketId,
              )
            }
          />
        ))}

        {selectedMarket && (
          <MapInfoWindow position={{ lat: selectedMarket.latitude, lng: selectedMarket.longitude }}>
            <span className={S.marketInfoWindowClassName}>{selectedMarket.name}</span>
          </MapInfoWindow>
        )}
      </Map>
      {statusMessage && (
        <p className={S.mapStatusClassName} role='status'>
          {statusMessage}
        </p>
      )}
      {isAddressSearchError && (
        <p className={S.mapStatusClassName} role='status'>
          {ADDRESS_SEARCH_ERROR_MESSAGE}
        </p>
      )}
    </section>
  );
};
