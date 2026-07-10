'use client';

import { useEffect, useState } from 'react';

export type GeolocationErrorCodeTypes =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNSUPPORTED';

type UseGeolocationOptionsTypes = Readonly<{
  enableHighAccuracy?: boolean;
  timeout?: number;
}>;

type CoordinatesTypes = Readonly<{
  lat: number;
  lng: number;
}>;

type UseGeolocationResultTypes = Readonly<{
  coordinates: CoordinatesTypes | null;
  errorCode: GeolocationErrorCodeTypes | null;
  isLoading: boolean;
}>;

const GEOLOCATION_ERROR_CODES: Record<number, GeolocationErrorCodeTypes> = {
  1: 'PERMISSION_DENIED',
  2: 'POSITION_UNAVAILABLE',
  3: 'TIMEOUT',
};

export const useGeolocation = ({
  enableHighAccuracy = true,
  timeout = 5000,
}: UseGeolocationOptionsTypes = {}): UseGeolocationResultTypes => {
  const [coordinates, setCoordinates] = useState<CoordinatesTypes | null>(null);
  const [errorCode, setErrorCode] = useState<GeolocationErrorCodeTypes | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const handleUnsupportedGeolocation = () => {
      if (!isSubscribed) {
        return;
      }

      setErrorCode('UNSUPPORTED');
      setIsLoading(false);
    };

    if (!navigator.geolocation) {
      handleUnsupportedGeolocation();

      return () => {
        isSubscribed = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isSubscribed) {
          setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
        }

        if (isSubscribed) {
          setIsLoading(false);
        }
      },
      (error) => {
        if (isSubscribed) {
          setErrorCode(GEOLOCATION_ERROR_CODES[error.code] ?? 'POSITION_UNAVAILABLE');
        }

        if (isSubscribed) {
          setIsLoading(false);
        }
      },
      { enableHighAccuracy, timeout },
    );

    return () => {
      isSubscribed = false;
    };
  }, [enableHighAccuracy, timeout]);

  return { coordinates, errorCode, isLoading };
};
