'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useKakaoLoginMutation } from '@/domains/auth/hooks/use-kakao-login-mutation';
import { getKakaoOAuthCallbackErrorMessage } from '@/domains/auth/model/kakao-login-error';
import { CLIENT_ROUTES } from '@/shared/constants';

export const OAuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error, mutate } = useKakaoLoginMutation();
  const hasRequestedLoginRef = useRef(false);
  const [{ code, oauthError, state }] = useState(() => ({
    code: searchParams.get('code'),
    oauthError: searchParams.get('error'),
    state: searchParams.get('state'),
  }));

  useEffect(() => {
    window.history.replaceState(window.history.state, '', CLIENT_ROUTES.oauthCallback);
  }, []);

  useEffect(() => {
    if (!code || !state || oauthError) {
      return;
    }

    if (hasRequestedLoginRef.current) {
      return;
    }

    hasRequestedLoginRef.current = true;

    mutate(
      { code, state },
      {
        onSuccess: () => {
          router.replace(CLIENT_ROUTES.markets);
        },
      },
    );
  }, [code, mutate, oauthError, router, state]);

  const errorMessage = getKakaoOAuthCallbackErrorMessage({
    code,
    loginError: error,
    oauthError,
    state,
  });

  return (
    <main>
      <h1>카카오 로그인</h1>
      {errorMessage ? (
        <>
          <p role='alert'>{errorMessage}</p>
          <Link href={CLIENT_ROUTES.login}>로그인 화면으로 돌아가기</Link>
        </>
      ) : (
        <p aria-live='polite'>로그인 정보를 확인하고 있습니다.</p>
      )}
    </main>
  );
};
