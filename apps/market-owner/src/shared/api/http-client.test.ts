import { afterEach, describe, expect, it, vi } from 'vitest';

import { createHttpClient } from './http-client';

describe('createHttpClient', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('adds the temporary development access token as a Bearer token', async () => {
    vi.stubEnv('VITE_PUBLIC_API_SERVER_BASE_URL', 'https://api.example.com');
    vi.stubEnv('VITE_DEV_ACCESS_TOKEN', 'temporary-access-token');

    const fetchMock = vi.fn(async (request: Request) => {
      expect(request.headers.get('Authorization')).toBe('Bearer temporary-access-token');

      return new Response(null, { status: 204 });
    });
    vi.stubGlobal('fetch', fetchMock);

    await createHttpClient().get('health');

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
