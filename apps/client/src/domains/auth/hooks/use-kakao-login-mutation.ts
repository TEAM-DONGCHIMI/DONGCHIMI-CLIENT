'use client';

import { useMutation } from '@tanstack/react-query';

import { postKakaoLogin, type KakaoLoginPayload } from '../api/kakao-login-api';

export const useKakaoLoginMutation = () => {
  return useMutation({
    mutationFn: (payload: KakaoLoginPayload) => postKakaoLogin(payload),
    retry: false,
  });
};
