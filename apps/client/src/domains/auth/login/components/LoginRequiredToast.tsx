'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@dongchimi/shared/toast';

import { AUTH_REQUIRED_TOAST_ID, AUTH_REQUIRED_TOAST_MESSAGE } from '@/shared/auth/auth-return-to';

type LoginRequiredToastProps = Readonly<{
  enabled: boolean;
}>;

export const LoginRequiredToast = ({ enabled }: LoginRequiredToastProps) => {
  const toast = useToast();
  const hasShownToastRef = useRef(false);

  useEffect(() => {
    if (!enabled || hasShownToastRef.current) {
      return;
    }

    hasShownToastRef.current = true;
    toast.error(AUTH_REQUIRED_TOAST_MESSAGE, {
      id: AUTH_REQUIRED_TOAST_ID,
    });

    const url = new URL(window.location.href);
    url.searchParams.delete('reason');
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [enabled, toast]);

  return null;
};
