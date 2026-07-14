'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useKakaoLoginMutation } from '@/domains/auth/hooks/use-kakao-login-mutation';
import { setAccessToken } from '@/shared/auth';
import { isApiError } from '@/shared/api';
import { CLIENT_ROUTES } from '@/shared/constants';

const getLoginErrorMessage = (error: unknown) => {
  if (!isApiError(error)) {
    return '로그인에 실패했습니다. 다시 시도해 주세요.';
  }

  switch (error.code) {
    case 'OAUTH_REQUIRED_INFO_MISSING':
      return '카카오 계정의 이메일과 성별 정보 제공에 동의해 주세요.';
    case 'DUPLICATE_SOCIAL_ACCOUNT':
      return '이미 가입된 카카오 계정입니다.';
    case 'INVALID_INPUT':
    case 'OAUTH_AUTHENTICATION_FAILED':
      return '카카오 인증이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.';
    default:
      return error.message || '로그인에 실패했습니다. 다시 시도해 주세요.';
  }
};

interface GetCallbackErrorMessageParams {
  code: string | null;
  hasAccessToken: boolean;
  isError: boolean;
  isSuccess: boolean;
  mutationError: unknown;
  oauthError: string | null;
}

const getCallbackErrorMessage = ({
  code,
  hasAccessToken,
  isError,
  isSuccess,
  mutationError,
  oauthError,
}: GetCallbackErrorMessageParams) => {
  if (oauthError) {
    return '카카오 로그인이 취소되었습니다.';
  }

  if (!code) {
    return '카카오 인증 정보를 확인할 수 없습니다.';
  }

  if (isError) {
    return getLoginErrorMessage(mutationError);
  }

  if (isSuccess && !hasAccessToken) {
    return '로그인 응답을 확인할 수 없습니다. 다시 시도해 주세요.';
  }

  return undefined;
};

export const OAuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, error, isError, isSuccess, mutate } = useKakaoLoginMutation();
  const hasRequestedLoginRef = useRef(false);
  const [code] = useState(() => searchParams.get('code'));
  const oauthError = searchParams.get('error');

  useEffect(() => {
    if (!code || oauthError) {
      return;
    }

    if (hasRequestedLoginRef.current) {
      return;
    }

    hasRequestedLoginRef.current = true;
    window.history.replaceState(window.history.state, '', CLIENT_ROUTES.oauthCallback);

    mutate(
      { code },
      {
        onSuccess: (response) => {
          const accessToken = response.data?.accessToken;

          if (!accessToken) {
            return;
          }

          setAccessToken(accessToken);
          router.replace(CLIENT_ROUTES.markets);
        },
      },
    );
  }, [code, mutate, oauthError, router]);

  const errorMessage = getCallbackErrorMessage({
    code,
    hasAccessToken: Boolean(data?.data?.accessToken),
    isError,
    isSuccess,
    mutationError: error,
    oauthError,
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
