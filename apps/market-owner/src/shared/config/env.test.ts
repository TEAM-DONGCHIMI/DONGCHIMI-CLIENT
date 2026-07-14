import { afterEach, describe, expect, it, vi } from 'vitest';

import { getMarketOwnerEnv } from './env';

describe('getMarketOwnerEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('keeps the same-origin root API base URL', () => {
    vi.stubEnv('VITE_PUBLIC_API_SERVER_BASE_URL', '/');

    expect(getMarketOwnerEnv().apiBaseUrl).toBe('/');
  });

  it('removes trailing slashes from an absolute API base URL', () => {
    vi.stubEnv('VITE_PUBLIC_API_SERVER_BASE_URL', ' https://api.dongchiimi.com/// ');

    expect(getMarketOwnerEnv().apiBaseUrl).toBe('https://api.dongchiimi.com');
  });

  it('returns undefined when the API base URL is blank', () => {
    vi.stubEnv('VITE_PUBLIC_API_SERVER_BASE_URL', '   ');

    expect(getMarketOwnerEnv().apiBaseUrl).toBeUndefined();
  });
});
