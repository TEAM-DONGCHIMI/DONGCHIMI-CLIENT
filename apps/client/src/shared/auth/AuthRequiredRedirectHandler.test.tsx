import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { render } from '@/test';

import { AuthRequiredRedirectHandler } from './AuthRequiredRedirectHandler';
import { redirectToLoginForAuthRequired } from './auth-required-redirect';

const navigationMocks = vi.hoisted(() => ({
  pathname: '/markets/mangwon-fresh',
  router: {
    replace: vi.fn(),
  },
}));

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationMocks.pathname,
  useRouter: () => navigationMocks.router,
}));

vi.mock('@dongchimi/shared/toast', () => ({
  useToast: () => toastMocks,
}));

describe('AuthRequiredRedirectHandler', () => {
  beforeEach(() => {
    navigationMocks.pathname = '/markets/mangwon-fresh';
    navigationMocks.router.replace.mockClear();
    toastMocks.error.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Toast를 즉시 한 번 표시하고 reason 없는 로그인 route로 soft replace한다', async () => {
    const replace = vi.fn();
    const waitForNavigation = vi.fn(() => Promise.resolve());
    const { rerender } = render(
      <StrictMode>
        <AuthRequiredRedirectHandler />
      </StrictMode>,
    );
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

    expect(toastMocks.error).toHaveBeenCalledTimes(1);
    expect(toastMocks.error).toHaveBeenCalledWith('서비스 이용을 위해 로그인이 필요해요.', {
      id: 'auth-required',
    });
    expect(navigationMocks.router.replace).toHaveBeenCalledTimes(1);
    expect(navigationMocks.router.replace).toHaveBeenCalledWith(
      '/login?returnTo=%2Fmarkets%2Fmangwon-fresh%2Fproducts%2F402%3Ftab%3Ddetail',
    );
    expect(toastMocks.error.mock.invocationCallOrder[0]).toBeLessThan(
      navigationMocks.router.replace.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
    );
    expect(replace).not.toHaveBeenCalled();
    expect(waitForNavigation).not.toHaveBeenCalled();
    expect(hasSettled).toBe(false);

    navigationMocks.pathname = '/login';
    rerender(
      <StrictMode>
        <AuthRequiredRedirectHandler />
      </StrictMode>,
    );
    await redirectPromise;

    expect(hasSettled).toBe(true);
    expect(toastMocks.error).toHaveBeenCalledTimes(1);
  });

  it('soft route가 완료되지 않으면 hard redirect fallback을 허용한다', async () => {
    vi.useFakeTimers();
    const replace = vi.fn();
    const waitForNavigation = vi.fn(() => Promise.resolve());
    render(<AuthRequiredRedirectHandler />);

    const redirectPromise = redirectToLoginForAuthRequired({
      location: { pathname: '/markets/mangwon-fresh', search: '' },
      replace,
      waitForNavigation,
    });

    expect(toastMocks.error).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();

    await vi.runAllTimersAsync();
    await redirectPromise;

    expect(replace).toHaveBeenCalledWith(
      '/login?reason=auth-required&returnTo=%2Fmarkets%2Fmangwon-fresh',
    );
  });

  it('여러 API instance의 redirect를 한 번의 로그인 이동이 완료될 때 함께 해제한다', async () => {
    const replace = vi.fn();
    const waitForNavigation = vi.fn(() => Promise.resolve());
    const { rerender } = render(<AuthRequiredRedirectHandler />);
    let firstHasSettled = false;
    let secondHasSettled = false;

    const firstRedirect = redirectToLoginForAuthRequired({
      location: { pathname: '/markets/mangwon-fresh', search: '?tab=detail' },
      replace,
      waitForNavigation,
    }).then(() => {
      firstHasSettled = true;
    });
    const secondRedirect = redirectToLoginForAuthRequired({
      location: { pathname: '/markets/mangwon-fresh', search: '?tab=detail' },
      replace,
      waitForNavigation,
    }).then(() => {
      secondHasSettled = true;
    });

    expect(toastMocks.error).toHaveBeenCalledTimes(1);
    expect(navigationMocks.router.replace).toHaveBeenCalledTimes(1);
    expect(firstHasSettled).toBe(false);
    expect(secondHasSettled).toBe(false);

    navigationMocks.pathname = '/login';
    rerender(<AuthRequiredRedirectHandler />);
    await Promise.all([firstRedirect, secondRedirect]);

    expect(firstHasSettled).toBe(true);
    expect(secondHasSettled).toBe(true);
    expect(replace).not.toHaveBeenCalled();
  });

  it('로그인 route에서 도착한 늦은 redirect event는 즉시 완료하고 다시 이동하지 않는다', async () => {
    navigationMocks.pathname = '/login';
    render(<AuthRequiredRedirectHandler />);
    const replace = vi.fn();
    const waitForNavigation = vi.fn(() => Promise.resolve());

    await expect(
      redirectToLoginForAuthRequired({
        location: { pathname: '/markets/mangwon-fresh', search: '?tab=detail' },
        replace,
        waitForNavigation,
      }),
    ).resolves.toBeUndefined();

    expect(toastMocks.error).not.toHaveBeenCalled();
    expect(navigationMocks.router.replace).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(waitForNavigation).not.toHaveBeenCalled();
  });
});
