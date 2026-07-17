import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AUTH_REQUIRED_REDIRECT_EVENT_NAME,
  type AuthRequiredRedirectEventDetail,
  redirectToLoginForAuthRequired,
} from './auth-required-redirect';

describe('redirectToLoginForAuthRequired', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('handler가 없으면 현재 마트 경로를 담은 로그인 URL로 hard replace한다', async () => {
    let completeNavigation: () => void = () => undefined;
    const navigationPromise = new Promise<void>((resolve) => {
      completeNavigation = resolve;
    });
    const replace = vi.fn();
    const waitForNavigation = vi.fn(() => navigationPromise);

    let hasSettled = false;
    const redirectPromise = redirectToLoginForAuthRequired({
      location: {
        pathname: '/markets/mangwon-fresh/products/402',
        search: '?tab=detail',
      },
      replace,
      waitForNavigation,
    }).then(() => {
      hasSettled = true;
    });

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(
      '/login?reason=auth-required&returnTo=%2Fmarkets%2Fmangwon-fresh%2Fproducts%2F402%3Ftab%3Ddetail',
    );
    expect(waitForNavigation).toHaveBeenCalledTimes(1);
    expect(hasSettled).toBe(false);

    completeNavigation();
    await redirectPromise;

    expect(hasSettled).toBe(true);
  });

  it('기본 hard navigation 대기는 pagehide에서 즉시 해제된다', async () => {
    vi.useFakeTimers();
    const replace = vi.fn();
    const redirectPromise = redirectToLoginForAuthRequired({
      location: { pathname: '/markets/mangwon-fresh', search: '' },
      replace,
    });

    window.dispatchEvent(new Event('pagehide'));

    await expect(redirectPromise).resolves.toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('hard navigation event가 없으면 bounded timeout 후 요청 대기를 해제한다', async () => {
    vi.useFakeTimers();
    const replace = vi.fn();
    const redirectPromise = redirectToLoginForAuthRequired({
      location: { pathname: '/markets/mangwon-fresh', search: '' },
      replace,
    });
    let hasSettled = false;
    void redirectPromise.then(() => {
      hasSettled = true;
    });

    expect(hasSettled).toBe(false);

    await vi.runAllTimersAsync();
    await redirectPromise;

    expect(hasSettled).toBe(true);
  });

  it('app handler가 event를 처리하면 hard replace 없이 soft navigation 완료를 기다린다', async () => {
    let completeSoftNavigation: () => void = () => undefined;
    const handleRedirect = (event: Event) => {
      const redirectEvent = event as CustomEvent<AuthRequiredRedirectEventDetail>;

      redirectEvent.preventDefault();
      completeSoftNavigation = redirectEvent.detail.complete;
    };
    const replace = vi.fn();
    const waitForNavigation = vi.fn(() => Promise.resolve());
    window.addEventListener(AUTH_REQUIRED_REDIRECT_EVENT_NAME, handleRedirect);

    try {
      let hasSettled = false;
      const redirectPromise = redirectToLoginForAuthRequired({
        location: { pathname: '/markets/mangwon-fresh', search: '?tab=detail' },
        replace,
        waitForNavigation,
      }).then(() => {
        hasSettled = true;
      });

      expect(replace).not.toHaveBeenCalled();
      expect(waitForNavigation).not.toHaveBeenCalled();
      expect(hasSettled).toBe(false);

      completeSoftNavigation();
      await redirectPromise;

      expect(hasSettled).toBe(true);
    } finally {
      window.removeEventListener(AUTH_REQUIRED_REDIRECT_EVENT_NAME, handleRedirect);
    }
  });

  it('이미 로그인 화면이면 redirect event와 navigation을 다시 시작하지 않는다', async () => {
    const dispatchEvent = vi.fn();
    const replace = vi.fn();
    const waitForNavigation = vi.fn(() => Promise.resolve());

    await expect(
      redirectToLoginForAuthRequired({
        dispatchEvent,
        location: { pathname: '/login', search: '?returnTo=%2Fmarkets%2Fmangwon-fresh' },
        replace,
        waitForNavigation,
      }),
    ).resolves.toBeUndefined();

    expect(dispatchEvent).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(waitForNavigation).not.toHaveBeenCalled();
  });

  it('처리된 soft navigation이 timeout되면 원래 로그인 URL로 hard replace한다', async () => {
    vi.useFakeTimers();
    const handleRedirect = (event: Event) => {
      event.preventDefault();
    };
    const replace = vi.fn();
    const waitForNavigation = vi.fn(() => Promise.resolve());
    window.addEventListener(AUTH_REQUIRED_REDIRECT_EVENT_NAME, handleRedirect);

    try {
      const redirectPromise = redirectToLoginForAuthRequired({
        location: { pathname: '/markets/mangwon-fresh', search: '' },
        replace,
        waitForNavigation,
      });

      expect(replace).not.toHaveBeenCalled();

      await vi.runAllTimersAsync();
      await redirectPromise;

      expect(waitForNavigation).toHaveBeenCalledTimes(1);
      expect(replace).toHaveBeenCalledWith(
        '/login?reason=auth-required&returnTo=%2Fmarkets%2Fmangwon-fresh',
      );
    } finally {
      window.removeEventListener(AUTH_REQUIRED_REDIRECT_EVENT_NAME, handleRedirect);
    }
  });
});
