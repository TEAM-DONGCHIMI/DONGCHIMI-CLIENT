import { CLIENT_ROUTES } from '@/shared/constants';

export const AUTH_REQUIRED_REASON = 'auth-required';
export const AUTH_REQUIRED_TOAST_ID = 'auth-required';
export const AUTH_REQUIRED_TOAST_MESSAGE = '서비스 이용을 위해 로그인이 필요해요.';

const AUTH_RETURN_TO_ORIGIN = 'https://auth-return-to.invalid';
const KAKAO_AUTHORIZE_PATH = '/api/auth/kakao/authorize';
const MAX_RETURN_TO_LENGTH = 2_048;

interface AuthReturnLocation {
  pathname: string;
  search: string;
}

const hasControlCharacter = (value: string) => {
  return Array.from(value).some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;

    return codePoint <= 31 || codePoint === 127;
  });
};

const isMarketPath = (pathname: string) => {
  return pathname === CLIENT_ROUTES.markets || pathname.startsWith(`${CLIENT_ROUTES.markets}/`);
};

export const normalizeAuthReturnTo = (value: unknown) => {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_RETURN_TO_LENGTH ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    hasControlCharacter(value)
  ) {
    return CLIENT_ROUTES.markets;
  }

  try {
    const url = new URL(value, AUTH_RETURN_TO_ORIGIN);

    if (url.origin !== AUTH_RETURN_TO_ORIGIN || !isMarketPath(url.pathname)) {
      return CLIENT_ROUTES.markets;
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return CLIENT_ROUTES.markets;
  }
};

export const buildAuthRequiredLoginHref = ({ pathname, search }: AuthReturnLocation) => {
  const searchParams = new URLSearchParams({
    reason: AUTH_REQUIRED_REASON,
    returnTo: normalizeAuthReturnTo(`${pathname}${search}`),
  });

  return `${CLIENT_ROUTES.login}?${searchParams.toString()}`;
};

export const buildKakaoAuthorizeHref = (returnTo: unknown) => {
  const searchParams = new URLSearchParams({
    returnTo: normalizeAuthReturnTo(returnTo),
  });

  return `${KAKAO_AUTHORIZE_PATH}?${searchParams.toString()}`;
};
