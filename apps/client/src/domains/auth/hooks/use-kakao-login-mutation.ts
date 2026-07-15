'use client';

import { useMutation } from '@tanstack/react-query';

import { postKakaoLogin, type KakaoLoginPayloadTypes } from '../api/kakao-login-api';

export const useKakaoLoginMutation = () => {
  return useMutation({
    mutationFn: (payload: KakaoLoginPayloadTypes) => postKakaoLogin(payload),
    retry: false,
  });
};
