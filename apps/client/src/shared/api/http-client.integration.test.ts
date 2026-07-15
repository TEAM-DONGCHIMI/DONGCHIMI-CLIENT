import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { httpClient } from './http-client';

const API_BASE_URL = 'https://api.test';

describe('httpClient', () => {
  beforeAll(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('MSW가 가로챈 JSON 응답을 반환한다', async () => {
    server.use(
      http.get(`${API_BASE_URL}/test-resource`, () => {
        return HttpResponse.json({ name: '동치미' });
      }),
    );

    const result = await httpClient.get<{ name: string }>('test-resource');

    expect(result).toEqual({ name: '동치미' });
  });

  it('로컬 테스트 토큰이 있으면 Bearer 헤더를 추가한다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_TEST_TOKEN', 'test-token');

    server.use(
      http.get(`${API_BASE_URL}/authorized-resource`, ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer test-token');

        return HttpResponse.json({ success: true });
      }),
    );

    await expect(httpClient.get<{ success: boolean }>('authorized-resource')).resolves.toEqual({
      success: true,
    });

    vi.stubEnv('NEXT_PUBLIC_API_TEST_TOKEN', '');
  });

  it('요청에 명시한 Authorization 헤더를 로컬 테스트 토큰으로 덮어쓰지 않는다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_TEST_TOKEN', 'test-token');

    server.use(
      http.get(`${API_BASE_URL}/authorized-resource`, ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer session-token');

        return HttpResponse.json({ success: true });
      }),
    );

    await expect(
      httpClient.get<{ success: boolean }>('authorized-resource', {
        headers: { Authorization: 'Bearer session-token' },
      }),
    ).resolves.toEqual({ success: true });

    vi.stubEnv('NEXT_PUBLIC_API_TEST_TOKEN', '');
  });
});
