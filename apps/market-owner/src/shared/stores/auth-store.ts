import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthBootstrapStatusTypes = 'authenticated' | 'idle' | 'refreshing' | 'unauthenticated';

interface AuthStoreStateTypes {
  accessToken?: string;
  bootstrapStatus: AuthBootstrapStatusTypes;
  isLoggedIn: boolean;
  clearAccessToken: () => void;
  clearSession: () => void;
  setAccessToken: (accessToken: string) => void;
  setBootstrapStatus: (bootstrapStatus: AuthBootstrapStatusTypes) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
}

export const AUTH_STORE_STORAGE_KEY = 'market-owner-auth';

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
      setAccessToken: (accessToken) => {
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
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
