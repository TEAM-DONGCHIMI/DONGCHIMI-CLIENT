import { useEffect, useRef } from 'react';

import { refreshAuthSession } from '@/shared/api';
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
      hasRequestedRefreshRef.current = false;
      useAuthStore.getState().setBootstrapStatus('authenticated');

      return;
    }

    if (hasRequestedRefreshRef.current) {
      return;
    }

    hasRequestedRefreshRef.current = true;
    useAuthStore.getState().setBootstrapStatus('refreshing');

    refreshAuthSession().catch(() => {
      if (useAuthStore.getState().isLoggedIn) {
        useAuthStore.getState().clearSession();
      }
    });
  }, [accessToken, isLoggedIn]);
};
