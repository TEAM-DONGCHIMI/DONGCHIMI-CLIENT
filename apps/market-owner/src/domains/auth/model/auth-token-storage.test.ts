import { afterEach, describe, expect, it } from 'vitest';

import { AUTH_ACCESS_TOKEN_STORAGE_KEY, authTokenStorage } from './auth-token-storage';

describe('authTokenStorage', () => {
  afterEach(() => {
    authTokenStorage.clearAccessToken();
  });

  it('stores access token in localStorage when persist is true', () => {
    authTokenStorage.setAccessToken('persisted-token', { persist: true });

    expect(localStorage.getItem(AUTH_ACCESS_TOKEN_STORAGE_KEY)).toBe('persisted-token');
    expect(sessionStorage.getItem(AUTH_ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
    expect(authTokenStorage.getAccessToken()).toBe('persisted-token');
  });

  it('stores access token in sessionStorage when persist is false', () => {
    authTokenStorage.setAccessToken('session-token', { persist: false });

    expect(sessionStorage.getItem(AUTH_ACCESS_TOKEN_STORAGE_KEY)).toBe('session-token');
    expect(localStorage.getItem(AUTH_ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
    expect(authTokenStorage.getAccessToken()).toBe('session-token');
  });
});
