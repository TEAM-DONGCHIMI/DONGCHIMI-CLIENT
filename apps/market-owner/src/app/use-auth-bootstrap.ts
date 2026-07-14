import { useEffect, useRef } from 'react';

import { refreshMarketOwnerAuth } from '@/domains/auth/api/auth-api';
import { useAuthStore } from '@/shared/stores/auth-store';

export const useAuthBootstrap = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hasRequestedRefreshRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) {
      useAuthStore.getState().setBootstrapStatus('unauthenticated');
      hasRequestedRefreshRef.current = false;

      return;
    }

    if (accessToken) {
      useAuthStore.getState().setBootstrapStatus('authenticated');

      return;
    }

    if (hasRequestedRefreshRef.current) {
      return;
    }

    let isCanceled = false;
    hasRequestedRefreshRef.current = true;
    useAuthStore.getState().setBootstrapStatus('refreshing');

    refreshMarketOwnerAuth()
      .then((response) => {
        if (!isCanceled) {
          useAuthStore.getState().setAccessToken(response.data.accessToken);
        }
      })
      .catch(() => {
        if (!isCanceled) {
          useAuthStore.getState().clearSession();
        }
      });

    return () => {
      isCanceled = true;
    };
  }, [accessToken, isLoggedIn]);
};
