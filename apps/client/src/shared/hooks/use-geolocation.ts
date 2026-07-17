'use client';

import { useCallback, useEffect, useState } from 'react';

import { requestCurrentPosition } from './use-geolocation-position';
import { useFocusRetryOnTimeout, usePermissionGrantedRetry } from './use-geolocation-retry';
import type {
  CoordinatesTypes,
  GeolocationErrorCodeTypes,
  UseGeolocationOptionsTypes,
  UseGeolocationResultTypes,
} from './use-geolocation.types';

export type { CoordinatesTypes, GeolocationErrorCodeTypes } from './use-geolocation.types';

export const useGeolocation = ({
  enableHighAccuracy = true,
  timeout = 5000,
}: UseGeolocationOptionsTypes = {}): UseGeolocationResultTypes => {
  const [coordinates, setCoordinates] = useState<CoordinatesTypes | null>(null);
  const [errorCode, setErrorCode] = useState<GeolocationErrorCodeTypes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestRevision, setRequestRevision] = useState(0);

  const retry = useCallback(() => {
    setRequestRevision((revision) => revision + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    if (!navigator.geolocation) {
      window.queueMicrotask(() => {
        if (!isActive) {
          return;
        }

        setErrorCode('UNSUPPORTED');
        setIsLoading(false);
      });

      return () => {
        isActive = false;
      };
    }

    void requestCurrentPosition({
      enableHighAccuracy,
      isActive: () => isActive,
      onError: (nextErrorCode) => {
        setErrorCode(nextErrorCode);
        setIsLoading(false);
      },
      onStart: () => {
        setErrorCode(null);
        setIsLoading(true);
      },
      onSuccess: (nextCoordinates) => {
        setCoordinates(nextCoordinates);
        setIsLoading(false);
      },
      timeout,
    });

    return () => {
      isActive = false;
    };
  }, [enableHighAccuracy, requestRevision, timeout]);

  usePermissionGrantedRetry(errorCode, retry);
  useFocusRetryOnTimeout(errorCode, retry);

  return { coordinates, errorCode, isLoading, retry };
};
