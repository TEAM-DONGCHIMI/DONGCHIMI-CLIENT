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
      http.get(`${API_BASE_URL}/test-resource`, ({ request }) => {
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBeNull();

        return HttpResponse.json({ name: '동치미' });
      }),
    );

    const result = await httpClient.get<{ name: string }>('test-resource');

    expect(result).toEqual({ name: '동치미' });
  });

  it('configured API origin 밖의 URL은 요청하지 않는다', async () => {
    await expect(httpClient.get('https://api.example.com/test-resource')).rejects.toMatchObject({
      type: 'configuration',
    });
  });
});
