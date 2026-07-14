import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AUTH_STORE_STORAGE_KEY, useAuthStore } from './auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('stores access token in memory and persists only the login hint', () => {
    useAuthStore.getState().setAccessToken('access-token');

    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(useAuthStore.getState().bootstrapStatus).toBe('authenticated');
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

  it('persists only the login hint in session storage when auto login is disabled', () => {
    useAuthStore.getState().setAccessToken('access-token', { isAutoLogin: false });

    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBe(
      JSON.stringify({
        state: {
          isLoggedIn: true,
        },
        version: 0,
      }),
    );
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('access-token');
  });

  it('persists only the login hint in local storage when auto login is enabled', () => {
    useAuthStore.getState().setAccessToken('session-access-token', { isAutoLogin: false });

    useAuthStore.getState().setAccessToken('local-access-token', { isAutoLogin: true });

    expect(useAuthStore.getState().accessToken).toBe('local-access-token');
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBe(
      JSON.stringify({
        state: {
          isLoggedIn: true,
        },
        version: 0,
      }),
    );
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('local-access-token');
    expect(sessionStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBeNull();
  });

  it('clears access token from memory', () => {
    useAuthStore.getState().setAccessToken('access-token');

    useAuthStore.getState().clearAccessToken();

    expect(useAuthStore.getState().accessToken).toBeUndefined();
    expect(useAuthStore.getState().bootstrapStatus).toBe('authenticated');
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
  });

  it('clears the login session hint without storing token data', () => {
    useAuthStore.getState().setAccessToken('access-token');

    useAuthStore.getState().clearSession();

    expect(useAuthStore.getState().accessToken).toBeUndefined();
    expect(useAuthStore.getState().bootstrapStatus).toBe('unauthenticated');
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).not.toContain('access-token');
  });

  it('updates bootstrap status without persisting it', () => {
    useAuthStore.getState().setBootstrapStatus('refreshing');

    expect(useAuthStore.getState().bootstrapStatus).toBe('refreshing');
    expect(localStorage.getItem(AUTH_STORE_STORAGE_KEY)).toBe(
      JSON.stringify({
        state: {
          isLoggedIn: false,
        },
        version: 0,
      }),
    );
  });
});
