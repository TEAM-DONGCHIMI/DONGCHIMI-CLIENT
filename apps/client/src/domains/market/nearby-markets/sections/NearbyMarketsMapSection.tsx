'use client';

import { useState } from 'react';

import { Map, MapInfoWindow, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

import type { GeolocationErrorCodeTypes } from '@/shared/hooks';

import { useNearbyMarketsMap } from '../NearbyMarketsClientProvider';
import * as S from '../NearbyMarketsPage.css';
import {
  CURRENT_LOCATION_ARIA_LABEL,
  CURRENT_LOCATION_MARKER_IMAGE,
  DEFAULT_CENTER,
  KAKAO_MAP_APP_KEY,
  LOAD_ERROR_MESSAGE,
  MAP_LOADING_MESSAGE,
  MAP_SECTION_ARIA_LABEL,
  MAP_ZOOM_LEVEL,
  PERMISSION_DENIED_MESSAGE,
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
  const { coordinates, errorCode, isMarketsError, markets } = useNearbyMarketsMap();
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_APP_KEY ?? '',
  });

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

  const selectedMarket = markets.find((market) => market.marketId === selectedMarketId) ?? null;
  const statusMessage = resolveStatusMessage(errorCode, isMarketsError);

  return (
    <section aria-label={MAP_SECTION_ARIA_LABEL} className={S.mapSectionClassName}>
      <Map
        center={coordinates ?? DEFAULT_CENTER}
        className={S.mapAreaClassName}
        level={MAP_ZOOM_LEVEL}
        onClick={() => setSelectedMarketId(null)}
      >
        {coordinates && (
          <MapMarker
            image={CURRENT_LOCATION_MARKER_IMAGE}
            position={coordinates}
            title={CURRENT_LOCATION_ARIA_LABEL}
          />
        )}

        {markets.map((market) => (
          <MapMarker
            key={market.marketId}
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
    </section>
  );
};
