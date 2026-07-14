'use client';

import { useState } from 'react';
import { IcLogoKakaoSizeSmall } from '@dongchimi/design-system/icons';
import Script from 'next/script';

import { getKakaoSdk } from '@/domains/auth/kakao-sdk';
import { getClientEnv } from '@/shared/config';
import * as S from './KakaoLoginButton.css';

interface KakaoLoginButtonProps {
  disabled?: boolean;
}

export const KakaoLoginButton = ({ disabled = false }: KakaoLoginButtonProps) => {
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const initializeKakaoSdk = () => {
    const kakaoSdk = getKakaoSdk();
    const { kakaoJavaScriptKey } = getClientEnv();

    if (!kakaoSdk || !kakaoJavaScriptKey) {
      setErrorMessage('카카오 로그인을 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    if (!kakaoSdk.isInitialized()) {
      kakaoSdk.init(kakaoJavaScriptKey);
    }

    if (!kakaoSdk.isInitialized()) {
      setErrorMessage('카카오 로그인을 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setIsSdkReady(false);
      return;
    }

    setErrorMessage(undefined);
    setIsSdkReady(true);
  };

  const startKakaoLogin = () => {
    const kakaoSdk = getKakaoSdk();
    const { kakaoRedirectUri } = getClientEnv();

    if (!kakaoSdk?.isInitialized() || !kakaoRedirectUri) {
      setErrorMessage('카카오 로그인 설정을 확인해 주세요.');
      return;
    }

    kakaoSdk.Auth.authorize({ redirectUri: kakaoRedirectUri });
  };

  return (
    <>
      <Script
        crossOrigin='anonymous'
        onError={() =>
          setErrorMessage('카카오 로그인을 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.')
        }
        onReady={initializeKakaoSdk}
        src='https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js'
        strategy='afterInteractive'
      />

      <button
        className={S.buttonClassName}
        disabled={disabled || !isSdkReady}
        onClick={startKakaoLogin}
        type='button'
      >
        <IcLogoKakaoSizeSmall aria-hidden='true' className={S.iconClassName} />
        <span>카카오톡으로 시작하기</span>
      </button>

      {errorMessage && <p role='alert'>{errorMessage}</p>}
    </>
  );
};
