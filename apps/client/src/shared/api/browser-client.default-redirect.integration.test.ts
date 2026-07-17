import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';

import { createBrowserApi } from './browser-client';

const redirectMocks = vi.hoisted(() => ({
  redirectToLoginForAuthRequired: vi.fn<() => Promise<void> | void>(),
}));

vi.mock('@/shared/auth/auth-required-redirect', () => redirectMocks);

const useUnauthorizedHandlers = () => {
  let protectedRequestCount = 0;

  server.use(
    http.get(`${window.location.origin}/api/protected`, () => {
      protectedRequestCount += 1;

      return HttpResponse.json({ success: false }, { status: 401 });
    }),
    http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
      return HttpResponse.json({ success: false }, { status: 401 });
    }),
  );

  return {
    getProtectedRequestCount: () => protectedRequestCount,
  };
};

describe('browser API default auth redirect', () => {
  beforeEach(() => {
    redirectMocks.redirectToLoginForAuthRequired.mockReset();
  });

  it('refresh 실패 후 주입값이 없으면 기본 로그인 redirect helper를 호출한다', async () => {
    redirectMocks.redirectToLoginForAuthRequired.mockResolvedValue();
    useUnauthorizedHandlers();

    const response = await createBrowserApi().get('protected', { throwHttpErrors: false });

    expect(response.status).toBe(401);
    expect(redirectMocks.redirectToLoginForAuthRequired).toHaveBeenCalledTimes(1);
  });

  it('진행 중인 기본 redirect는 공유하고 settle 후 별개의 최종 401을 다시 처리한다', async () => {
    let completeRedirect: () => void = () => undefined;
    const redirectPromise = new Promise<void>((resolve) => {
      completeRedirect = resolve;
    });
    redirectMocks.redirectToLoginForAuthRequired
      .mockReturnValueOnce(redirectPromise)
      .mockResolvedValue();
    const { getProtectedRequestCount } = useUnauthorizedHandlers();
    const api = createBrowserApi();

    const firstRequest = api.get('protected', { throwHttpErrors: false });
    await vi.waitFor(() => {
      expect(redirectMocks.redirectToLoginForAuthRequired).toHaveBeenCalledTimes(1);
    });
    const overlappingRequest = api.get('protected', { throwHttpErrors: false });
    await vi.waitFor(() => {
      expect(getProtectedRequestCount()).toBe(2);
    });

    expect(redirectMocks.redirectToLoginForAuthRequired).toHaveBeenCalledTimes(1);

    completeRedirect();
    await Promise.all([firstRequest, overlappingRequest]);
    await api.get('protected', { throwHttpErrors: false });

    expect(redirectMocks.redirectToLoginForAuthRequired).toHaveBeenCalledTimes(2);
  });
});
