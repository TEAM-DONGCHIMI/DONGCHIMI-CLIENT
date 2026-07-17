import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { createBrowserApi } from './browser-client';

const createDeferred = () => {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
};

describe('browser API auth refresh', () => {
  it('401 응답 후 session을 갱신하고 원 요청을 한 번 재시도한다', async () => {
    let protectedRequestCount = 0;
    let refreshRequestCount = 0;
    const onFinalUnauthorized = vi.fn();

    server.use(
      http.get(`${window.location.origin}/api/protected`, () => {
        protectedRequestCount += 1;

        if (protectedRequestCount === 1) {
          return HttpResponse.json({ success: false }, { status: 401 });
        }

        return HttpResponse.json({ success: true });
      }),
      http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
        refreshRequestCount += 1;

        return HttpResponse.json({ success: true });
      }),
    );

    const result = await createBrowserApi({ onFinalUnauthorized }).get('protected').json();

    expect(result).toEqual({ success: true });
    expect(protectedRequestCount).toBe(2);
    expect(refreshRequestCount).toBe(1);
    expect(onFinalUnauthorized).not.toHaveBeenCalled();
  });

  it.each(['post', 'put'] as const)(
    'body가 있는 %s 요청도 session 갱신 후 동일한 body로 재시도한다',
    async (method) => {
      const requestBodies: unknown[] = [];
      let protectedRequestCount = 0;
      const onFinalUnauthorized = vi.fn();

      server.use(
        http[method](`${window.location.origin}/api/protected`, async ({ request }) => {
          protectedRequestCount += 1;
          requestBodies.push(await request.json());

          if (protectedRequestCount === 1) {
            return HttpResponse.json({ success: false }, { status: 401 });
          }

          return HttpResponse.json({ success: true });
        }),
        http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
          return HttpResponse.json({ success: true });
        }),
      );

      const result = await createBrowserApi({ onFinalUnauthorized })
        [method]('protected', { json: { productId: 'product-1' } })
        .json();

      expect(result).toEqual({ success: true });
      expect(requestBodies).toEqual([{ productId: 'product-1' }, { productId: 'product-1' }]);
      expect(onFinalUnauthorized).not.toHaveBeenCalled();
    },
  );

  it('동시에 발생한 401 응답은 하나의 refresh 요청을 공유한다', async () => {
    const requestCounts = new Map<string, number>();
    let refreshRequestCount = 0;
    const onFinalUnauthorized = vi.fn();
    const refreshGate = createDeferred();

    server.use(
      http.get(`${window.location.origin}/api/protected/:id`, ({ params }) => {
        const id = String(params.id);
        const requestCount = (requestCounts.get(id) ?? 0) + 1;
        requestCounts.set(id, requestCount);

        if (requestCount === 1) {
          return HttpResponse.json({ success: false }, { status: 401 });
        }

        return HttpResponse.json({ id, success: true });
      }),
      http.post(`${window.location.origin}/api/auth/token/refresh`, async () => {
        refreshRequestCount += 1;
        await refreshGate.promise;

        return HttpResponse.json({ success: true });
      }),
    );

    const api = createBrowserApi({ onFinalUnauthorized });
    const resultsPromise = Promise.all([
      api.get('protected/1').json(),
      api.get('protected/2').json(),
    ]);

    await vi.waitFor(() => {
      expect(requestCounts).toEqual(
        new Map([
          ['1', 1],
          ['2', 1],
        ]),
      );
      expect(refreshRequestCount).toBe(1);
    });
    refreshGate.resolve();

    const results = await resultsPromise;

    expect(results).toEqual([
      { id: '1', success: true },
      { id: '2', success: true },
    ]);
    expect(requestCounts).toEqual(
      new Map([
        ['1', 2],
        ['2', 2],
      ]),
    );
    expect(refreshRequestCount).toBe(1);
    expect(onFinalUnauthorized).not.toHaveBeenCalled();
  });

  it.each([
    {
      createRefreshResponse: () => HttpResponse.json({ success: false }, { status: 401 }),
      name: '401',
    },
    {
      createRefreshResponse: () => HttpResponse.json({ success: false }, { status: 500 }),
      name: '500',
    },
    {
      createRefreshResponse: () => HttpResponse.error(),
      name: 'network 오류',
    },
  ])(
    'refresh $name 실패 시 원 요청을 재시도하지 않고 최종 401을 한 번 알린다',
    async ({ createRefreshResponse }) => {
      let protectedRequestCount = 0;
      let refreshRequestCount = 0;
      const onFinalUnauthorized = vi.fn();

      server.use(
        http.get(`${window.location.origin}/api/protected`, () => {
          protectedRequestCount += 1;

          return HttpResponse.json({ success: false }, { status: 401 });
        }),
        http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
          refreshRequestCount += 1;

          return createRefreshResponse();
        }),
      );

      const response = await createBrowserApi({ onFinalUnauthorized }).get('protected', {
        throwHttpErrors: false,
      });

      expect(response.status).toBe(401);
      expect(protectedRequestCount).toBe(1);
      expect(refreshRequestCount).toBe(1);
      expect(onFinalUnauthorized).toHaveBeenCalledTimes(1);
    },
  );

  it('로그인 hard navigation이 끝날 때까지 최종 401 요청을 pending으로 유지한다', async () => {
    let completeNavigation: () => void = () => undefined;
    const navigationPromise = new Promise<void>((resolve) => {
      completeNavigation = resolve;
    });
    const onFinalUnauthorized = vi.fn(() => navigationPromise);

    server.use(
      http.get(`${window.location.origin}/api/protected`, () => {
        return HttpResponse.json({ success: false }, { status: 401 });
      }),
      http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    let hasSettled = false;
    const request = createBrowserApi({ onFinalUnauthorized })
      .get('protected', { throwHttpErrors: false })
      .then((response) => {
        hasSettled = true;

        return response;
      });

    await vi.waitFor(() => {
      expect(onFinalUnauthorized).toHaveBeenCalledTimes(1);
    });
    expect(hasSettled).toBe(false);

    completeNavigation();

    await expect(request).resolves.toMatchObject({ status: 401 });
    expect(hasSettled).toBe(true);
  });

  it('refresh 성공 후 재시도도 401이면 추가 refresh 없이 최종 401을 알린다', async () => {
    let protectedRequestCount = 0;
    let refreshRequestCount = 0;
    const onFinalUnauthorized = vi.fn();

    server.use(
      http.get(`${window.location.origin}/api/protected`, () => {
        protectedRequestCount += 1;

        return HttpResponse.json({ success: false }, { status: 401 });
      }),
      http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
        refreshRequestCount += 1;

        return HttpResponse.json({ success: true });
      }),
    );

    const response = await createBrowserApi({ onFinalUnauthorized }).get('protected', {
      throwHttpErrors: false,
    });

    expect(response.status).toBe(401);
    expect(protectedRequestCount).toBe(2);
    expect(refreshRequestCount).toBe(1);
    expect(onFinalUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('동시에 발생한 최종 401은 refresh와 로그인 이동 알림을 각각 한 번만 수행한다', async () => {
    let refreshRequestCount = 0;
    const onFinalUnauthorized = vi.fn();
    const protectedRequestIds = new Set<string>();
    const refreshGate = createDeferred();

    server.use(
      http.get(`${window.location.origin}/api/protected/:id`, ({ params }) => {
        protectedRequestIds.add(String(params.id));

        return HttpResponse.json({ success: false }, { status: 401 });
      }),
      http.post(`${window.location.origin}/api/auth/token/refresh`, async () => {
        refreshRequestCount += 1;
        await refreshGate.promise;

        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    const api = createBrowserApi({ onFinalUnauthorized });
    const responsesPromise = Promise.all([
      api.get('protected/1', { throwHttpErrors: false }),
      api.get('protected/2', { throwHttpErrors: false }),
    ]);

    await vi.waitFor(() => {
      expect(protectedRequestIds).toEqual(new Set(['1', '2']));
      expect(refreshRequestCount).toBe(1);
    });
    refreshGate.resolve();

    const responses = await responsesPromise;

    expect(responses.map(({ status }) => status)).toEqual([401, 401]);
    expect(refreshRequestCount).toBe(1);
    expect(onFinalUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('완료된 로그인 이동 알림은 이후 별개의 최종 401을 막지 않는다', async () => {
    let refreshRequestCount = 0;
    const onFinalUnauthorized = vi.fn();

    server.use(
      http.get(`${window.location.origin}/api/protected`, () => {
        return HttpResponse.json({ success: false }, { status: 401 });
      }),
      http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
        refreshRequestCount += 1;

        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    const api = createBrowserApi({ onFinalUnauthorized });

    await api.get('protected', { throwHttpErrors: false });
    await api.get('protected', { throwHttpErrors: false });

    expect(refreshRequestCount).toBe(2);
    expect(onFinalUnauthorized).toHaveBeenCalledTimes(2);
  });

  it('인증 API 자체의 401은 refresh하지 않는다', async () => {
    let authRequestCount = 0;
    const onFinalUnauthorized = vi.fn();

    server.use(
      http.post(`${window.location.origin}/api/auth/kakao/login`, () => {
        authRequestCount += 1;

        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    const response = await createBrowserApi({ onFinalUnauthorized }).post('auth/kakao/login', {
      throwHttpErrors: false,
    });

    expect(response.status).toBe(401);
    expect(authRequestCount).toBe(1);
    expect(onFinalUnauthorized).not.toHaveBeenCalled();
  });

  it.each([403, 404, 500])(
    '%i 응답은 refresh하거나 로그인 이동을 알리지 않는다',
    async (status) => {
      let refreshRequestCount = 0;
      const onFinalUnauthorized = vi.fn();

      server.use(
        http.get(`${window.location.origin}/api/protected`, () => {
          return HttpResponse.json({ success: false }, { status });
        }),
        http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
          refreshRequestCount += 1;

          return HttpResponse.json({ success: true });
        }),
      );

      const response = await createBrowserApi({ onFinalUnauthorized }).get('protected', {
        throwHttpErrors: false,
      });

      expect(response.status).toBe(status);
      expect(refreshRequestCount).toBe(0);
      expect(onFinalUnauthorized).not.toHaveBeenCalled();
    },
  );

  it('network 오류는 refresh하거나 로그인 이동을 알리지 않는다', async () => {
    let refreshRequestCount = 0;
    const onFinalUnauthorized = vi.fn();

    server.use(
      http.get(`${window.location.origin}/api/protected`, () => HttpResponse.error()),
      http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
        refreshRequestCount += 1;

        return HttpResponse.json({ success: true });
      }),
    );

    const request = createBrowserApi({ onFinalUnauthorized }).get('protected');

    await expect(request).rejects.toBeDefined();
    expect(refreshRequestCount).toBe(0);
    expect(onFinalUnauthorized).not.toHaveBeenCalled();
  });
});
