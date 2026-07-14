import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { POST } from './route';

const API_BASE_URL = 'https://api.test';

describe('POST /api/auth/kakao/login', () => {
  beforeAll(() => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('백엔드 token을 response body에서 제거하고 HttpOnly cookie로 전달한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, async ({ request }) => {
        await expect(request.json()).resolves.toEqual({ code: 'authorization-code' });

        return HttpResponse.json(
          {
            code: 'SUCCESS',
            data: { accessToken: 'access-token' },
            message: '요청에 성공했습니다.',
            success: true,
          },
          {
            headers: {
              'Set-Cookie':
                'refreshToken=refresh-token; HttpOnly; Secure; SameSite=Lax; Path=/v1/auth/token/refresh',
            },
          },
        );
      }),
    );

    const response = await POST(
      new Request('http://localhost/api/auth/kakao/login', {
        body: JSON.stringify({ code: 'authorization-code' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    await expect(response.json()).resolves.toEqual({
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      success: true,
    });

    const setCookieHeaders = response.headers.getSetCookie();

    expect(setCookieHeaders).toEqual(
      expect.arrayContaining([
        expect.stringContaining('access_token=access-token'),
        expect.stringContaining('refreshToken=refresh-token'),
      ]),
    );
    expect(setCookieHeaders.join(';')).toContain('Path=/api/auth/token/refresh');
    expect(setCookieHeaders.join(';')).toContain('HttpOnly');
  });

  it('빈 code를 백엔드로 전달하지 않는다', async () => {
    const response = await POST(
      new Request('http://localhost/api/auth/kakao/login', {
        body: JSON.stringify({ code: '' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ code: 'INVALID_INPUT', success: false });
  });
});
