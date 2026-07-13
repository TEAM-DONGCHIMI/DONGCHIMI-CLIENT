const ACCESS_TOKEN_STORAGE_KEY = 'dongchimi.access-token';

let accessToken: string | undefined;

const getSessionStorage = () => {
  return typeof window === 'undefined' ? undefined : window.sessionStorage;
};

export const getAccessToken = () => {
  accessToken ??= getSessionStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? undefined;

  return accessToken;
};

export const setAccessToken = (nextAccessToken: string) => {
  accessToken = nextAccessToken;
  getSessionStorage()?.setItem(ACCESS_TOKEN_STORAGE_KEY, nextAccessToken);
};

export const clearAccessToken = () => {
  accessToken = undefined;
  getSessionStorage()?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};
