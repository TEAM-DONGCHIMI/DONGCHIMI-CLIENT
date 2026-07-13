import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStoreStateTypes {
  accessToken?: string;
  isLoggedIn: boolean;
  clearAccessToken: () => void;
  clearSession: () => void;
  setAccessToken: (accessToken: string) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
}

export const AUTH_STORE_STORAGE_KEY = 'market-owner-auth';

export const useAuthStore = create<AuthStoreStateTypes>()(
  persist(
    (set) => ({
      accessToken: undefined,
      isLoggedIn: false,
      clearAccessToken: () => {
        set({ accessToken: undefined });
      },
      clearSession: () => {
        set({ accessToken: undefined, isLoggedIn: false });
      },
      setAccessToken: (accessToken) => {
        set({ accessToken, isLoggedIn: true });
      },
      setLoggedIn: (isLoggedIn) => {
        set({ isLoggedIn });
      },
    }),
    {
      name: AUTH_STORE_STORAGE_KEY,
      partialize: ({ isLoggedIn }) => ({ isLoggedIn }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
