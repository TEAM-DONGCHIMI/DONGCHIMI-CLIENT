'use client';

import { useEffect, useState } from 'react';

import { Map, MapInfoWindow, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

import type { GeolocationErrorCodeTypes } from '@/shared/hooks';

import { useNearbyMarketsMap } from '../NearbyMarketsClientProvider';
import * as S from '../NearbyMarketsPage.css';
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

type MapCoordinatesTypes = Readonly<{ lat: number; lng: number }>;

type KakaoGeocoderResultTypes = Readonly<{
  x: string;
  y: string;
}>;

type SelectedAddressCoordinatesTypes = Readonly<{
  address: string;
  coordinates: MapCoordinatesTypes;
}>;

declare global {
  interface Window {
    kakao?: {
      maps?: {
        services?: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: KakaoGeocoderResultTypes[], status: string) => void,
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
      };
    };
  }
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

export const NearbyMarketsMapSection = () => {
  const {
    coordinates,
    errorCode,
    isMarketsError,
    markets,
    onSelectedCoordinatesChange,
    selectedMapAddress,
  } = useNearbyMarketsMap();
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_MAP_APP_KEY ?? '',
    libraries: ['services'],
  });

  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null);
  const [selectedAddressCoordinates, setSelectedAddressCoordinates] =
    useState<SelectedAddressCoordinatesTypes | null>(null);
  const [addressSearchErrorAddress, setAddressSearchErrorAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedMapAddress) {
      return;
    }

    const Geocoder = window.kakao?.maps?.services?.Geocoder;
    const okStatus = window.kakao?.maps?.services?.Status.OK;

    if (loading || error || Geocoder == null || okStatus == null) {
      return;
    }

    const geocoder = new Geocoder();
    let isActive = true;

    geocoder.addressSearch(selectedMapAddress, (result, status) => {
      if (!isActive) {
        return;
      }

      const [firstResult] = result;

      if (status !== okStatus || firstResult == null) {
        setSelectedAddressCoordinates(null);
        setAddressSearchErrorAddress(selectedMapAddress);
        onSelectedCoordinatesChange(null);

        return;
      }

      const nextCoordinates = {
        lat: Number(firstResult.y),
        lng: Number(firstResult.x),
      };

      setAddressSearchErrorAddress(null);
      setSelectedAddressCoordinates({
        address: selectedMapAddress,
        coordinates: nextCoordinates,
      });
      onSelectedCoordinatesChange(nextCoordinates);
    });

    return () => {
      isActive = false;
    };
  }, [error, loading, onSelectedCoordinatesChange, selectedMapAddress]);

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
  const selectedCoordinates =
    selectedAddressCoordinates?.address === selectedMapAddress
      ? selectedAddressCoordinates.coordinates
      : null;
  const isAddressSearchError = addressSearchErrorAddress === selectedMapAddress;
  const center = selectedCoordinates ?? coordinates ?? DEFAULT_CENTER;

  return (
    <section aria-label={MAP_SECTION_ARIA_LABEL} className={S.mapSectionClassName}>
      <Map
        center={center}
        className={S.mapAreaClassName}
        level={MAP_ZOOM_LEVEL}
        onClick={() => setSelectedMarketId(null)}
      >
        {selectedCoordinates && (
          <MapMarker
            image={SELECTED_LOCATION_MARKER_IMAGE}
            position={selectedCoordinates}
            title={SELECTED_LOCATION_ARIA_LABEL}
          />
        )}

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
