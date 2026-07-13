export const AUTH_ACCESS_TOKEN_STORAGE_KEY = 'dongchimi.market-owner.accessToken';

type TokenStorageTypes = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;

const getSessionStorage = (): TokenStorageTypes | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.sessionStorage;
};

const getLocalStorage = (): TokenStorageTypes | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.localStorage;
};

export const authTokenStorage = {
  clearAccessToken: () => {
    getSessionStorage()?.removeItem(AUTH_ACCESS_TOKEN_STORAGE_KEY);
    getLocalStorage()?.removeItem(AUTH_ACCESS_TOKEN_STORAGE_KEY);
  },
  getAccessToken: () => {
    return (
      getSessionStorage()?.getItem(AUTH_ACCESS_TOKEN_STORAGE_KEY) ??
      getLocalStorage()?.getItem(AUTH_ACCESS_TOKEN_STORAGE_KEY)
    );
  },
  setAccessToken: (accessToken: string, { persist }: { persist: boolean }) => {
    const targetStorage = persist ? getLocalStorage() : getSessionStorage();
    const staleStorage = persist ? getSessionStorage() : getLocalStorage();

    staleStorage?.removeItem(AUTH_ACCESS_TOKEN_STORAGE_KEY);
    targetStorage?.setItem(AUTH_ACCESS_TOKEN_STORAGE_KEY, accessToken);
  },
};
