'use client';

import { useState } from 'react';

import { Map, MapInfoWindow, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

import type { GeolocationErrorCodeTypes } from '@/shared/hooks';

import { useNearbyMarketsInfiniteQuery } from '../../hooks/use-nearby-markets-infinite-query';
import * as S from '../NearbyMarketsPage.css';
import { flattenNearbyMarketsPages } from '../utils/flatten-nearby-markets-pages';
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

export interface NearbyMarketsMapSectionProps {
  coordinates: { lat: number; lng: number } | null;
  errorCode: GeolocationErrorCodeTypes | null;
  keyword?: string;
  marketSearchOrigin: { lat: number; lng: number };
}

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

export const NearbyMarketsMapSection = ({
  coordinates,
  errorCode,
  keyword,
  marketSearchOrigin,
}: NearbyMarketsMapSectionProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_APP_KEY ?? '',
  });

  const { data, isError: isMarketsError } = useNearbyMarketsInfiniteQuery({
    keyword,
    lat: marketSearchOrigin.lat,
    lng: marketSearchOrigin.lng,
  });
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

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

  const markets = flattenNearbyMarketsPages(data);
  const selectedMarket = markets.find((market) => market.id === selectedMarketId) ?? null;
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
            key={market.id}
            position={{ lat: market.latitude, lng: market.longitude }}
            title={market.martName}
            onClick={() =>
              setSelectedMarketId((current) => (current === market.id ? null : market.id))
            }
          />
        ))}

        {selectedMarket && (
          <MapInfoWindow position={{ lat: selectedMarket.latitude, lng: selectedMarket.longitude }}>
            <span className={S.marketInfoWindowClassName}>{selectedMarket.martName}</span>
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
