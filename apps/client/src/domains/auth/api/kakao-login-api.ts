import { browserApi } from '@/shared/api';
import { normalizeKakaoLoginError } from '../model/kakao-login-error';

export interface KakaoLoginPayload {
  code: string;
  state: string;
}

export interface KakaoLoginResponse {
  code: string;
  message: string;
  success: boolean;
}

export const postKakaoLogin = async (payload: KakaoLoginPayload) => {
  try {
    return await browserApi.post<KakaoLoginResponse>('auth/kakao/login', {
      json: payload,
    });
  } catch (error) {
    throw normalizeKakaoLoginError(error);
  }
};
