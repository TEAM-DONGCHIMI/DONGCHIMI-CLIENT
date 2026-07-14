export const AUTH_COOKIE_NAMES = {
  accessToken: 'access_token',
  refreshToken: 'refreshToken',
} as const;

export const UPSTREAM_AUTH_COOKIE_NAMES = {
  refreshToken: 'RefreshToken',
} as const;

export const AUTH_COOKIE_PATHS = {
  refresh: '/api/auth/token/refresh',
} as const;
