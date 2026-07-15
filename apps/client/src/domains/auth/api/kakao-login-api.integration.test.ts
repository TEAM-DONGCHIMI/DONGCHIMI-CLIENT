import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';
import { KakaoLoginError } from '../model/kakao-login-error';
import { postKakaoLogin } from './kakao-login-api';

describe('postKakaoLogin', () => {
  it('인가 코드를 token 노출 없이 BFF Route Handler에 전달한다', async () => {
    server.use(
      http.post(`${window.location.origin}/api/auth/kakao/login`, async ({ request }) => {
        const payload = await request.json();

        expect(request.credentials).toBe('include');
        expect(payload).toEqual({ code: 'authorization-code', state: 'oauth-state' });

        return HttpResponse.json({
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    const result = await postKakaoLogin({ code: 'authorization-code', state: 'oauth-state' });

    expect(result).toEqual({
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      success: true,
    });
  });

  it('API error를 사용자 표시용 KakaoLoginError로 정규화한다', async () => {
    server.use(
      http.post(`${window.location.origin}/api/auth/kakao/login`, () => {
        return HttpResponse.json(
          {
            code: 'OAUTH_AUTHENTICATION_FAILED',
            message: '소셜 로그인 인증에 실패했습니다.',
            success: false,
          },
          { status: 401 },
        );
      }),
    );

    const request = postKakaoLogin({ code: 'expired-code', state: 'oauth-state' });

    await expect(request).rejects.toBeInstanceOf(KakaoLoginError);
    await expect(request).rejects.toMatchObject({
      message: '카카오 인증이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.',
    });
  });
});
