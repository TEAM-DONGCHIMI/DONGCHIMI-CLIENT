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

  it('removes trailing slashes from the public S3 base URL', () => {
    vi.stubEnv('VITE_PUBLIC_S3_BASE_URL', ' https://static.dongchimi.kr/// ');

    expect(getMarketOwnerEnv().s3BaseUrl).toBe('https://static.dongchimi.kr');
  });

  it('returns undefined when the public S3 base URL is blank', () => {
    vi.stubEnv('VITE_PUBLIC_S3_BASE_URL', '   ');

    expect(getMarketOwnerEnv().s3BaseUrl).toBeUndefined();
  });
});
