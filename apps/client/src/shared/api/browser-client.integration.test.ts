import { HttpResponse, delay, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';
import { createBrowserApi } from './browser-client';

describe('browser API auth refresh', () => {
  it('401 응답 후 session을 갱신하고 원 요청을 한 번 재시도한다', async () => {
    let protectedRequestCount = 0;
    let refreshRequestCount = 0;

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

    const result = await createBrowserApi().get('protected').json();

    expect(result).toEqual({ success: true });
    expect(protectedRequestCount).toBe(2);
    expect(refreshRequestCount).toBe(1);
  });

  it('동시에 발생한 401 응답은 하나의 refresh 요청을 공유한다', async () => {
    const requestCounts = new Map<string, number>();
    let refreshRequestCount = 0;

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
        await delay(20);

        return HttpResponse.json({ success: true });
      }),
    );

    const api = createBrowserApi();
    const results = await Promise.all([
      api.get('protected/1').json(),
      api.get('protected/2').json(),
    ]);

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
  });

  it('refresh가 실패하면 원 요청을 재시도하지 않는다', async () => {
    let protectedRequestCount = 0;
    let refreshRequestCount = 0;

    server.use(
      http.get(`${window.location.origin}/api/protected`, () => {
        protectedRequestCount += 1;

        return HttpResponse.json({ success: false }, { status: 401 });
      }),
      http.post(`${window.location.origin}/api/auth/token/refresh`, () => {
        refreshRequestCount += 1;

        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    const response = await createBrowserApi().get('protected', { throwHttpErrors: false });

    expect(response.status).toBe(401);
    expect(protectedRequestCount).toBe(1);
    expect(refreshRequestCount).toBe(1);
  });

  it('인증 API 자체의 401은 refresh하지 않는다', async () => {
    let authRequestCount = 0;

    server.use(
      http.post(`${window.location.origin}/api/auth/kakao/login`, () => {
        authRequestCount += 1;

        return HttpResponse.json({ success: false }, { status: 401 });
      }),
    );

    const response = await createBrowserApi().post('auth/kakao/login', {
      throwHttpErrors: false,
    });

    expect(response.status).toBe(401);
    expect(authRequestCount).toBe(1);
  });
});
