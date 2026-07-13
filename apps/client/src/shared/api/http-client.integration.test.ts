import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { clearAccessToken, setAccessToken } from '@/shared/auth';
import { httpClient } from './http-client';

const API_BASE_URL = 'https://api.test';

describe('httpClient', () => {
  beforeAll(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    clearAccessToken();
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

  it('저장된 access token을 Authorization 헤더에 포함한다', async () => {
    setAccessToken('access-token');

    server.use(
      http.get(`${API_BASE_URL}/authenticated-resource`, ({ request }) => {
        return HttpResponse.json({ authorization: request.headers.get('Authorization') });
      }),
    );

    const result = await httpClient.get<{ authorization: string }>('authenticated-resource');

    expect(result.authorization).toBe('Bearer access-token');
  });
});
