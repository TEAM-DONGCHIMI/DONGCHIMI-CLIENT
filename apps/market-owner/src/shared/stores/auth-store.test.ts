import { afterEach, describe, expect, it } from 'vitest';

import { AUTH_STORE_STORAGE_KEY, useAuthStore } from './auth-store';

describe('useAuthStore', () => {
  afterEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('stores access token in memory and persists only the login hint', () => {
    useAuthStore.getState().setAccessToken('access-token');

    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBe(
      JSON.stringify({
        state: {
          isLoggedIn: true,
        },
        version: 0,
      }),
    );
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('access-token');
    expect(sessionStorage.length).toBe(0);
  });

  it('clears access token from memory', () => {
    useAuthStore.getState().setAccessToken('access-token');

    useAuthStore.getState().clearAccessToken();

    expect(useAuthStore.getState().accessToken).toBeUndefined();
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
  });

  it('clears the login session hint without storing token data', () => {
    useAuthStore.getState().setAccessToken('access-token');

    useAuthStore.getState().clearSession();

    expect(useAuthStore.getState().accessToken).toBeUndefined();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('access-token');
  });
});
