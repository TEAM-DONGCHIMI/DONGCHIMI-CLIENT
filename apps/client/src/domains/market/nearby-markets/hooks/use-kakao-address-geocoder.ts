'use client';

import { useEffect, useState } from 'react';

type MapCoordinatesTypes = Readonly<{ lat: number; lng: number }>;

type KakaoGeocoderResultTypes = Readonly<{
  x: string;
  y: string;
}>;

type ResolvedAddressCoordinatesTypes = Readonly<{
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

type UseKakaoAddressGeocoderOptionsTypes = Readonly<{
  address: string | null;
  onCoordinatesChange: (coordinates: MapCoordinatesTypes | null) => void;
  ready: boolean;
}>;

export const useKakaoAddressGeocoder = ({
  address,
  onCoordinatesChange,
  ready,
}: UseKakaoAddressGeocoderOptionsTypes) => {
  const [resolved, setResolved] = useState<ResolvedAddressCoordinatesTypes | null>(null);
  const [errorAddress, setErrorAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !ready) {
      return;
    }

    const Geocoder = window.kakao?.maps?.services?.Geocoder;
    const okStatus = window.kakao?.maps?.services?.Status.OK;

    if (Geocoder == null || okStatus == null) {
      return;
    }

    const geocoder = new Geocoder();
    let isActive = true;

    geocoder.addressSearch(address, (result, status) => {
      if (!isActive) {
        return;
      }

      const [firstResult] = result;

      if (status !== okStatus || firstResult == null) {
        setResolved(null);
        setErrorAddress(address);
        onCoordinatesChange(null);

        return;
      }

      const nextCoordinates = {
        lat: Number(firstResult.y),
        lng: Number(firstResult.x),
      };

      if (!Number.isFinite(nextCoordinates.lat) || !Number.isFinite(nextCoordinates.lng)) {
        setResolved(null);
        setErrorAddress(address);
        onCoordinatesChange(null);

        return;
      }

      setErrorAddress(null);
      setResolved({ address, coordinates: nextCoordinates });
      onCoordinatesChange(nextCoordinates);
    });

    return () => {
      isActive = false;
    };
  }, [address, onCoordinatesChange, ready]);

  return {
    coordinates: resolved?.address === address ? resolved.coordinates : null,
    isError: address != null && errorAddress === address,
  };
};
