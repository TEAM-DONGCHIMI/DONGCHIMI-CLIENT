'use client';

import { useMutation } from '@tanstack/react-query';

import { kakaoLogin, type KakaoLoginPayloadTypes } from '../api/kakao-login-api';

export const useKakaoLoginMutation = () => {
  return useMutation({
    mutationFn: (payload: KakaoLoginPayloadTypes) => kakaoLogin(payload),
    retry: false,
  });
};
