import { API_ENDPOINTS } from '@dongchimi/shared/api';

import { httpClient, type UserApiTypes } from '@/shared/api';

export type KakaoLoginPayloadTypes = UserApiTypes.OAuthLoginRequest;
export type KakaoLoginResponseTypes = UserApiTypes.ApiResponseOAuthLoginResponse;

export const kakaoLogin = async (payload: KakaoLoginPayloadTypes) => {
  return httpClient.post<KakaoLoginResponseTypes>(API_ENDPOINTS.user.auth.socialLogin('kakao'), {
    credentials: 'include',
    json: payload,
  });
};
