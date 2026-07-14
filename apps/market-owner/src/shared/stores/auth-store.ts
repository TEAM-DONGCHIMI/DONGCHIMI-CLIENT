import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthBootstrapStatusTypes = 'authenticated' | 'idle' | 'refreshing' | 'unauthenticated';

interface AuthStoreStateTypes {
  accessToken?: string;
  bootstrapStatus: AuthBootstrapStatusTypes;
  isLoggedIn: boolean;
  clearAccessToken: () => void;
  clearSession: () => void;
  setAccessToken: (accessToken: string, options?: { isAutoLogin?: boolean }) => void;
  setBootstrapStatus: (bootstrapStatus: AuthBootstrapStatusTypes) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
}

export const AUTH_STORE_STORAGE_KEY = 'market-owner-auth';

let selectedAuthStorage: Storage | undefined;

const getStoredAuthStorage = (key: string) => {
  if (localStorage.getItem(key) !== null) {
    return localStorage;
  }

  return sessionStorage.getItem(key) !== null ? sessionStorage : localStorage;
};

const getSelectedAuthStorage = () =>
  selectedAuthStorage ?? getStoredAuthStorage(AUTH_STORE_STORAGE_KEY);

const selectAuthStorage = (isAutoLogin: boolean) => {
  selectedAuthStorage = isAutoLogin ? localStorage : sessionStorage;
};

const authStorage = {
  getItem: (key: string) => {
    selectedAuthStorage = getStoredAuthStorage(key);

    return selectedAuthStorage.getItem(key);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
  setItem: (key: string, value: string) => {
    const storage = getSelectedAuthStorage();
    const staleStorage = storage === localStorage ? sessionStorage : localStorage;

    storage.setItem(key, value);
    staleStorage.removeItem(key);
  },
};

export const useAuthStore = create<AuthStoreStateTypes>()(
  persist(
    (set) => ({
      accessToken: undefined,
      bootstrapStatus: 'idle',
      isLoggedIn: false,
      clearAccessToken: () => {
        set({ accessToken: undefined });
      },
      clearSession: () => {
        set({ accessToken: undefined, bootstrapStatus: 'unauthenticated', isLoggedIn: false });
      },
      setAccessToken: (accessToken, options) => {
        if (options?.isAutoLogin !== undefined) {
          selectAuthStorage(options.isAutoLogin);
        } else if (
          selectedAuthStorage?.getItem(AUTH_STORE_STORAGE_KEY) === null &&
          localStorage.getItem(AUTH_STORE_STORAGE_KEY) === null &&
          sessionStorage.getItem(AUTH_STORE_STORAGE_KEY) === null
        ) {
          selectAuthStorage(true);
        }

        set({ accessToken, bootstrapStatus: 'authenticated', isLoggedIn: true });
      },
      setBootstrapStatus: (bootstrapStatus) => {
        set({ bootstrapStatus });
      },
      setLoggedIn: (isLoggedIn) => {
        set({ isLoggedIn });
      },
    }),
    {
      name: AUTH_STORE_STORAGE_KEY,
      partialize: ({ isLoggedIn }) => ({ isLoggedIn }),
      storage: createJSONStorage(() => authStorage),
    },
  ),
);
