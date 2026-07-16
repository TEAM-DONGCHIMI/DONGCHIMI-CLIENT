'use client';

import { useEffect } from 'react';

import type { GeolocationErrorCodeTypes } from './use-geolocation.types';

export const usePermissionGrantedRetry = (
  errorCode: GeolocationErrorCodeTypes | null,
  retry: () => void,
) => {
  useEffect(() => {
    if (errorCode !== 'PERMISSION_DENIED' && errorCode !== 'TIMEOUT') {
      return;
    }

    let isActive = true;
    let permissionStatus: PermissionStatus | null = null;

    if (!navigator.permissions?.query) {
      return () => {
        isActive = false;
      };
    }

    const retryIfPermissionGranted = () => {
      if (!isActive || permissionStatus?.state !== 'granted') {
        return;
      }

      retry();
    };

    const observePermission = async () => {
      try {
        permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

        if (!isActive) {
          return;
        }

        permissionStatus.addEventListener('change', retryIfPermissionGranted);
        window.addEventListener('focus', retryIfPermissionGranted, { once: true });
        retryIfPermissionGranted();
      } catch {
        return;
      }
    };

    void observePermission();

    return () => {
      isActive = false;

      permissionStatus?.removeEventListener('change', retryIfPermissionGranted);
      window.removeEventListener('focus', retryIfPermissionGranted);
    };
  }, [errorCode, retry]);
};

export const useFocusRetryOnTimeout = (
  errorCode: GeolocationErrorCodeTypes | null,
  retry: () => void,
) => {
  useEffect(() => {
    if (errorCode !== 'TIMEOUT') {
      return;
    }

    const handleWindowFocus = () => {
      retry();
    };

    window.addEventListener('focus', handleWindowFocus, { once: true });

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [errorCode, retry]);
};
