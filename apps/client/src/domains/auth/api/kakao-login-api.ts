import { browserApi, type UserApiTypes } from '@/shared/api';

export type KakaoLoginPayloadTypes = UserApiTypes.OAuthLoginRequest;

export interface KakaoLoginResponse {
  code: string;
  message: string;
  success: boolean;
}

export const postKakaoLogin = async (payload: KakaoLoginPayloadTypes) => {
  return browserApi.post<KakaoLoginResponse>('auth/kakao/login', {
    json: payload,
  });
};
