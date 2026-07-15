import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthBootstrapStatusTypes = 'authenticated' | 'idle' | 'refreshing' | 'unauthenticated';

export interface AuthAccountTypes {
  email: string;
  marketName?: string;
  marketThumbnailUrl?: string;
}

interface AuthStoreStateTypes {
  account?: AuthAccountTypes;
  accessToken?: string;
  bootstrapStatus: AuthBootstrapStatusTypes;
  isLoggedIn: boolean;
  marketId?: number;
  clearAccessToken: () => void;
  clearSession: () => void;
  setAccessToken: (
    accessToken: string,
    options?: {
      account?: AuthAccountTypes;
      isAutoLogin?: boolean;
      marketId?: number | null;
    },
  ) => void;
  setAccount: (account?: AuthAccountTypes) => void;
  setBootstrapStatus: (bootstrapStatus: AuthBootstrapStatusTypes) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setMarketId: (marketId?: number) => void;
}

export const AUTH_STORE_STORAGE_KEY = 'market-owner-auth';

let selectedAuthStorage: Storage | undefined;

const getAuthStorageEntry = (key: string) => {
  const localStorageValue = localStorage.getItem(key);

  if (localStorageValue !== null) {
    return { storage: localStorage, value: localStorageValue };
  }

  const sessionStorageValue = sessionStorage.getItem(key);

  return {
    storage: sessionStorageValue !== null ? sessionStorage : localStorage,
    value: sessionStorageValue,
  };
};

const getSelectedAuthStorageEntry = (key: string) => {
  if (selectedAuthStorage !== undefined) {
    return {
      storage: selectedAuthStorage,
      value: selectedAuthStorage.getItem(key),
    };
  }

  return getAuthStorageEntry(key);
};

const selectAuthStorage = (isAutoLogin: boolean) => {
  selectedAuthStorage = isAutoLogin ? localStorage : sessionStorage;
};

const authStorage = {
  getItem: (key: string) => {
    const { storage, value } = getAuthStorageEntry(key);

    selectedAuthStorage = storage;

    return value;
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
  setItem: (key: string, value: string) => {
    const { storage } = getSelectedAuthStorageEntry(key);
    const staleStorage = storage === localStorage ? sessionStorage : localStorage;

    storage.setItem(key, value);
    staleStorage.removeItem(key);
  },
};

export const useAuthStore = create<AuthStoreStateTypes>()(
  persist(
    (set) => ({
      account: undefined,
      accessToken: undefined,
      bootstrapStatus: 'idle',
      isLoggedIn: false,
      marketId: undefined,
      clearAccessToken: () => {
        set({ accessToken: undefined });
      },
      clearSession: () => {
        set({
          accessToken: undefined,
          bootstrapStatus: 'unauthenticated',
          isLoggedIn: false,
          account: undefined,
          marketId: undefined,
        });
      },
      setAccessToken: (accessToken, options) => {
        if (options?.isAutoLogin !== undefined) {
          selectAuthStorage(options.isAutoLogin);
        } else if (getSelectedAuthStorageEntry(AUTH_STORE_STORAGE_KEY).value === null) {
          selectAuthStorage(true);
        }

        set((state) => ({
          accessToken,
          account: options && 'account' in options ? (options.account ?? undefined) : state.account,
          bootstrapStatus: 'authenticated',
          isLoggedIn: true,
          marketId:
            options && 'marketId' in options ? (options.marketId ?? undefined) : state.marketId,
        }));
      },
      setAccount: (account) => {
        set({ account });
      },
      setBootstrapStatus: (bootstrapStatus) => {
        set({ bootstrapStatus });
      },
      setLoggedIn: (isLoggedIn) => {
        set({ isLoggedIn });
      },
      setMarketId: (marketId) => {
        set({ marketId });
      },
    }),
    {
      name: AUTH_STORE_STORAGE_KEY,
      partialize: ({ account, isLoggedIn, marketId }) => ({ account, isLoggedIn, marketId }),
      storage: createJSONStorage(() => authStorage),
    },
  ),
);
