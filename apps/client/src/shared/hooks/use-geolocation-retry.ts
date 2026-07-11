'use client';

import { useEffect } from 'react';

import type { GeolocationErrorCodeTypes } from './use-geolocation.types';

export const usePermissionGrantedRetry = (retry: () => void) => {
  useEffect(() => {
    let isActive = true;
    let permissionStatus: PermissionStatus | null = null;

    if (!navigator.permissions?.query) {
      return () => {
        isActive = false;
      };
    }

    const handlePermissionChange = () => {
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

        permissionStatus.addEventListener('change', handlePermissionChange);
      } catch {
        return;
      }
    };

    void observePermission();

    return () => {
      isActive = false;

      permissionStatus?.removeEventListener('change', handlePermissionChange);
    };
  }, [retry]);
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
