import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api';
import { server } from '@/test';
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

  it.each([
    [401, 'OAUTH_AUTHENTICATION_FAILED', 'auth'],
    [409, 'DUPLICATE_SOCIAL_ACCOUNT', 'validation'],
  ] as const)(
    '공통 HTTP client가 %i 응답을 %s ApiError로 정규화한다',
    async (status, code, type) => {
      server.use(
        http.post(`${window.location.origin}/api/auth/kakao/login`, () => {
          return HttpResponse.json(
            {
              code,
              message: '소셜 로그인 인증에 실패했습니다.',
              success: false,
            },
            { status },
          );
        }),
      );

      const request = postKakaoLogin({ code: 'expired-code', state: 'oauth-state' });

      await expect(request).rejects.toBeInstanceOf(ApiError);
      await expect(request).rejects.toMatchObject({
        code,
        message: '소셜 로그인 인증에 실패했습니다.',
        status,
        type,
      });
    },
  );
});
