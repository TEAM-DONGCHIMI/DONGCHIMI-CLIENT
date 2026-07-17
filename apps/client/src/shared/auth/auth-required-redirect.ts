import { CLIENT_ROUTES } from '@/shared/constants';

import { buildAuthRequiredLoginHref } from './auth-return-to';

const NAVIGATION_FALLBACK_TIMEOUT_MS = 5_000;
const SOFT_NAVIGATION_FALLBACK_TIMEOUT_MS = 5_000;

export const AUTH_REQUIRED_REDIRECT_EVENT_NAME = 'dongchimi:auth-required-redirect';

export interface AuthRequiredRedirectEventDetail {
  complete: () => void;
  loginHref: string;
}

interface AuthRequiredRedirectOptions {
  dispatchEvent?: (event: Event) => boolean;
  location?: Readonly<{
    pathname: string;
    search: string;
  }>;
  replace?: (href: string) => void;
  waitForNavigation?: () => Promise<void>;
}

const waitForPageHideOrTimeout = () => {
  return new Promise<void>((resolve) => {
    const settle = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('pagehide', settle);
      resolve();
    };
    const timeoutId = window.setTimeout(settle, NAVIGATION_FALLBACK_TIMEOUT_MS);

    window.addEventListener('pagehide', settle, { once: true });
  });
};

interface WaitForSoftNavigationOptions {
  loginHref: string;
  replace: (href: string) => void;
  softNavigationPromise: Promise<void>;
  waitForNavigation: () => Promise<void>;
}

const waitForSoftNavigationOrHardFallback = ({
  loginHref,
  replace,
  softNavigationPromise,
  waitForNavigation,
}: WaitForSoftNavigationOptions) => {
  return new Promise<void>((resolve) => {
    const settle = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };
    const timeoutId = window.setTimeout(() => {
      const hardNavigationPromise = waitForNavigation();

      replace(loginHref);
      void hardNavigationPromise.then(settle, settle);
    }, SOFT_NAVIGATION_FALLBACK_TIMEOUT_MS);

    void softNavigationPromise.then(settle);
  });
};

export const redirectToLoginForAuthRequired = ({
  dispatchEvent = (event) => window.dispatchEvent(event),
  location = window.location,
  replace = (href) => window.location.replace(href),
  waitForNavigation = waitForPageHideOrTimeout,
}: AuthRequiredRedirectOptions = {}) => {
  if (location.pathname === CLIENT_ROUTES.login) {
    return Promise.resolve();
  }

  const loginHref = buildAuthRequiredLoginHref({
    pathname: location.pathname,
    search: location.search,
  });
  let completeSoftNavigation: () => void = () => undefined;
  const softNavigationPromise = new Promise<void>((resolve) => {
    completeSoftNavigation = resolve;
  });
  const redirectEvent = new CustomEvent<AuthRequiredRedirectEventDetail>(
    AUTH_REQUIRED_REDIRECT_EVENT_NAME,
    {
      cancelable: true,
      detail: {
        complete: completeSoftNavigation,
        loginHref,
      },
    },
  );

  dispatchEvent(redirectEvent);

  if (redirectEvent.defaultPrevented) {
    return waitForSoftNavigationOrHardFallback({
      loginHref,
      replace,
      softNavigationPromise,
      waitForNavigation,
    });
  }

  const hardNavigationPromise = waitForNavigation();

  replace(loginHref);

  // Handler가 없는 환경에서도 hard navigation 중 기존 query error UI가 렌더되지 않도록 대기합니다.
  return hardNavigationPromise;
};
