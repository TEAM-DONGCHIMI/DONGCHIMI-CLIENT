import { browserApi, type UserApiTypes } from '@/shared/api';

export type KakaoLoginPayloadTypes = UserApiTypes.OAuthLoginRequest;

export interface KakaoLoginResponseTypes {
  code: string;
  message: string;
  success: boolean;
}

export const kakaoLogin = async (payload: KakaoLoginPayloadTypes) => {
  return browserApi.post<KakaoLoginResponseTypes>('auth/kakao/login', {
    json: payload,
  });
};
