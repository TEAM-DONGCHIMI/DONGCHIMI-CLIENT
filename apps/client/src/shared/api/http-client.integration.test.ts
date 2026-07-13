import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';
import { httpClient } from './http-client';

describe('httpClient', () => {
  it('동일 출처 API의 JSON 응답을 반환한다', async () => {
    server.use(
      http.get('*/test-resource', ({ request }) => {
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBeNull();

        return HttpResponse.json({ name: '동치미' });
      }),
    );

    const result = await httpClient.get<{ name: string }>('/test-resource');

    expect(result).toEqual({ name: '동치미' });
  });

  it('외부 origin 요청은 차단한다', async () => {
    await expect(httpClient.get('https://api.example.com/test-resource')).rejects.toMatchObject({
      type: 'configuration',
    });
  });
});
