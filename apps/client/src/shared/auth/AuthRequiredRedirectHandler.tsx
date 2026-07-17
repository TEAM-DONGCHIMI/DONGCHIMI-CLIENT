'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@dongchimi/shared/toast';

import {
  AUTH_REQUIRED_REDIRECT_EVENT_NAME,
  type AuthRequiredRedirectEventDetail,
} from '@/shared/auth/auth-required-redirect';
import { AUTH_REQUIRED_TOAST_ID, AUTH_REQUIRED_TOAST_MESSAGE } from '@/shared/auth/auth-return-to';
import { CLIENT_ROUTES } from '@/shared/constants';

const getSoftLoginHref = (loginHref: string) => {
  const url = new URL(loginHref, window.location.origin);
  url.searchParams.delete('reason');

  return `${url.pathname}${url.search}`;
};

export const AuthRequiredRedirectHandler = () => {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const isNavigationPendingRef = useRef(false);
  const pendingNavigationCompletionsRef = useRef(new Set<() => void>());

  useEffect(() => {
    const handleAuthRequiredRedirect = (event: Event) => {
      const redirectEvent = event as CustomEvent<AuthRequiredRedirectEventDetail>;

      if (!redirectEvent.detail?.loginHref || !redirectEvent.detail.complete) {
        return;
      }

      redirectEvent.preventDefault();

      if (pathname === CLIENT_ROUTES.login) {
        redirectEvent.detail.complete();

        return;
      }

      pendingNavigationCompletionsRef.current.add(redirectEvent.detail.complete);

      if (isNavigationPendingRef.current) {
        return;
      }

      isNavigationPendingRef.current = true;

      toast.error(AUTH_REQUIRED_TOAST_MESSAGE, {
        id: AUTH_REQUIRED_TOAST_ID,
      });
      router.replace(getSoftLoginHref(redirectEvent.detail.loginHref));
    };

    window.addEventListener(AUTH_REQUIRED_REDIRECT_EVENT_NAME, handleAuthRequiredRedirect);

    return () => {
      window.removeEventListener(AUTH_REQUIRED_REDIRECT_EVENT_NAME, handleAuthRequiredRedirect);
    };
  }, [pathname, router, toast]);

  useEffect(() => {
    if (pathname !== CLIENT_ROUTES.login || !isNavigationPendingRef.current) {
      return;
    }

    pendingNavigationCompletionsRef.current.forEach((complete) => complete());
    pendingNavigationCompletionsRef.current.clear();
    isNavigationPendingRef.current = false;
  }, [pathname]);

  return null;
};
