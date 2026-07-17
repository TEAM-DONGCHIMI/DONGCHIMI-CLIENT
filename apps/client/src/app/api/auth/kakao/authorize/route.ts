import { randomBytes } from 'node:crypto';

import { NextResponse } from 'next/server';

import {
  clearKakaoOAuthCookies,
  setKakaoOAuthReturnToCookie,
  setKakaoOAuthStateCookie,
} from '@/shared/auth';
import { normalizeAuthReturnTo } from '@/shared/auth/auth-return-to';
import { getServerEnv } from '@/shared/config/server-env';
import { CLIENT_ROUTES } from '@/shared/constants';

export const runtime = 'nodejs';

const KAKAO_AUTHORIZATION_ENDPOINT = 'https://kauth.kakao.com/oauth/authorize';
const OAUTH_CONFIGURATION_ERROR = 'oauth_configuration_error';

const normalizeRedirectUri = (request: Request, value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  try {
    const redirectUri = new URL(value);
    const requestOrigin = new URL(request.url).origin;

    if (
      (redirectUri.protocol !== 'http:' && redirectUri.protocol !== 'https:') ||
      redirectUri.origin !== requestOrigin ||
      redirectUri.pathname !== CLIENT_ROUTES.oauthCallback
    ) {
      return undefined;
    }

    return redirectUri.toString();
  } catch {
    return undefined;
  }
};

const createConfigurationErrorResponse = (request: Request) => {
  const callbackUrl = new URL(CLIENT_ROUTES.oauthCallback, request.url);
  callbackUrl.searchParams.set('error', OAUTH_CONFIGURATION_ERROR);

  const response = NextResponse.redirect(callbackUrl);
  response.headers.set('Cache-Control', 'no-store');

  return clearKakaoOAuthCookies(response);
};

export const GET = (request: Request) => {
  const { kakaoRedirectUri, kakaoRestApiKey } = getServerEnv();
  const redirectUri = normalizeRedirectUri(request, kakaoRedirectUri);

  if (!kakaoRestApiKey || !redirectUri) {
    return createConfigurationErrorResponse(request);
  }

  const state = randomBytes(32).toString('base64url');
  const returnTo = normalizeAuthReturnTo(new URL(request.url).searchParams.get('returnTo'));
  const authorizationUrl = new URL(KAKAO_AUTHORIZATION_ENDPOINT);

  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('client_id', kakaoRestApiKey);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizationUrl);
  response.headers.set('Cache-Control', 'no-store');
  setKakaoOAuthStateCookie(response, state);
  setKakaoOAuthReturnToCookie(response, returnTo);

  return response;
};
