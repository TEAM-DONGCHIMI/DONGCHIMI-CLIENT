import { browserApi } from '@/shared/api';

export interface KakaoLoginPayload {
  code: string;
  state: string;
}

export interface KakaoLoginResponse {
  code: string;
  message: string;
  success: boolean;
}

export const postKakaoLogin = (payload: KakaoLoginPayload) => {
  return browserApi.post<KakaoLoginResponse>('auth/kakao/login', {
    json: payload,
  });
};
