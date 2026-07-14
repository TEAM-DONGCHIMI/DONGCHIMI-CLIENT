export const AUTH_COOKIE_NAMES = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
} as const;

export const AUTH_COOKIE_PATHS = {
  refresh: '/api/auth/token/refresh',
} as const;
