import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';
import { postKakaoLogin } from './kakao-login-api';

describe('postKakaoLogin', () => {
  it('인가 코드를 token 노출 없이 BFF Route Handler에 전달한다', async () => {
    server.use(
      http.post(`${window.location.origin}/api/auth/kakao/login`, async ({ request }) => {
        const payload = await request.json();

        expect(request.credentials).toBe('include');
        expect(payload).toEqual({ code: 'authorization-code' });

        return HttpResponse.json({
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    const result = await postKakaoLogin({ code: 'authorization-code' });

    expect(result).toEqual({
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      success: true,
    });
  });
});
