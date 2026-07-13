import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { kakaoLogin } from './kakao-login-api';

const API_BASE_URL = 'https://api.test';

describe('kakaoLogin', () => {
  beforeAll(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('인가 코드를 credentials 포함 POST body로 전달한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, async ({ request }) => {
        const payload = await request.json();

        expect(request.credentials).toBe('include');
        expect(payload).toEqual({ code: 'authorization-code' });

        return HttpResponse.json({
          code: 'SUCCESS',
          data: { accessToken: 'access-token' },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    const result = await kakaoLogin({ code: 'authorization-code' });

    expect(result.data?.accessToken).toBe('access-token');
  });
});
