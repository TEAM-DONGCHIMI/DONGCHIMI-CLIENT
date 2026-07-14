import { ApiResponseValidationError } from '@dongchimi/shared/api';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '../stores/auth-store';

const { HTTPErrorMock, mockKyRequest } = vi.hoisted(() => {
  class HTTPErrorMock extends Error {
    data?: unknown;
    response: Response;

    constructor(response: Response, data?: unknown) {
      super(`HTTP Error ${response.status}`);
      this.name = 'HTTPError';
      this.response = response;
      this.data = data;
    }
  }

  return {
    HTTPErrorMock,
    mockKyRequest: vi.fn(),
  };
});

vi.mock('ky', () => ({
  default: {
    create: vi.fn(() => mockKyRequest),
  },
  HTTPError: HTTPErrorMock,
  NetworkError: class NetworkError extends Error {},
  TimeoutError: class TimeoutError extends Error {},
}));

vi.mock('../config', () => ({
  getMarketOwnerEnv: () => ({
    apiBaseUrl: 'https://api.test',
    sentryDsn: '',
  }),
}));

describe('httpClient auth refresh', () => {
  beforeEach(() => {
    mockKyRequest.mockReset();
    useAuthStore.getState().clearSession();
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
  });

  it('attaches the access token from the auth store', async () => {
    const { httpClient } = await import('./http-client');

    useAuthStore.getState().setAccessToken('access-token');
    mockKyRequest.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true })));

    await expect(httpClient.get('/v1/protected')).resolves.toEqual({ ok: true });

    const requestOptions = mockKyRequest.mock.calls[0]?.[1];

    expect(requestOptions?.headers.get('Authorization')).toBe('Bearer access-token');
  });

  it('refreshes the access token and retries the original request once after 401', async () => {
    const { httpClient } = await import('./http-client');
    const unauthorizedError = new HTTPErrorMock(new Response(null, { status: 401 }), {
      success: false,
      code: 'INVALID_INPUT',
      message: '유효하지 않은 토큰입니다.',
    });
    const refreshResponse = {
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        accessToken: 'refreshed-access-token',
      },
    };

    useAuthStore.getState().setAccessToken('stale-access-token');
    mockKyRequest
      .mockRejectedValueOnce(unauthorizedError)
      .mockResolvedValueOnce(new Response(JSON.stringify(refreshResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true })));

    await expect(httpClient.get('/v1/protected')).resolves.toEqual({ ok: true });

    expect(mockKyRequest).toHaveBeenCalledTimes(3);
    expect(mockKyRequest.mock.calls[1]?.[0]).toBe('/v1/auth/token/refresh');
    expect(mockKyRequest.mock.calls[1]?.[1]).toMatchObject({
      credentials: 'include',
      method: 'post',
    });
    expect(mockKyRequest.mock.calls[2]?.[0]).toBe('/v1/protected');
    expect(mockKyRequest.mock.calls[2]?.[1].headers.get('Authorization')).toBe(
      'Bearer refreshed-access-token',
    );
    expect(useAuthStore.getState().accessToken).toBe('refreshed-access-token');
  });

  it('shares one in-flight refresh request across concurrent callers', async () => {
    const { refreshAuthSession } = await import('./http-client');
    let resolveRefresh!: (response: Response) => void;
    const refreshResponse = new Promise<Response>((resolve) => {
      resolveRefresh = resolve;
    });

    useAuthStore.getState().setLoggedIn(true);
    mockKyRequest.mockReturnValueOnce(refreshResponse);

    const firstRefresh = refreshAuthSession();
    const secondRefresh = refreshAuthSession();

    expect(firstRefresh).toBe(secondRefresh);
    expect(mockKyRequest).toHaveBeenCalledTimes(1);

    resolveRefresh(
      new Response(
        JSON.stringify({
          success: true,
          code: 'SUCCESS',
          message: 'ok',
          data: {
            accessToken: 'shared-access-token',
          },
        }),
      ),
    );

    await expect(Promise.all([firstRefresh, secondRefresh])).resolves.toEqual([
      'shared-access-token',
      'shared-access-token',
    ]);
    expect(useAuthStore.getState().accessToken).toBe('shared-access-token');
  });

  it('does not restore the auth session when refresh completes after logout', async () => {
    const { refreshAuthSession } = await import('./http-client');
    let resolveRefresh!: (response: Response) => void;
    const refreshResponse = new Promise<Response>((resolve) => {
      resolveRefresh = resolve;
    });

    useAuthStore.getState().setLoggedIn(true);
    mockKyRequest.mockReturnValueOnce(refreshResponse);

    const refresh = refreshAuthSession();

    useAuthStore.getState().clearSession();
    resolveRefresh(
      new Response(
        JSON.stringify({
          success: true,
          code: 'SUCCESS',
          message: 'ok',
          data: {
            accessToken: 'ignored-access-token',
          },
        }),
      ),
    );

    await expect(refresh).resolves.toBe('ignored-access-token');
    expect(useAuthStore.getState().accessToken).toBeUndefined();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(useAuthStore.getState().bootstrapStatus).toBe('unauthenticated');
  });

  it('rejects a refresh response that does not match the API contract', async () => {
    const { refreshAuthSession } = await import('./http-client');

    useAuthStore.getState().setLoggedIn(true);
    mockKyRequest.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          code: 'SUCCESS',
          message: 'ok',
          data: {},
        }),
      ),
    );

    await expect(refreshAuthSession()).rejects.toBeInstanceOf(ApiResponseValidationError);
    expect(useAuthStore.getState().accessToken).toBeUndefined();
  });

  it('keeps the auth session when the retry request fails after a successful refresh', async () => {
    const { httpClient } = await import('./http-client');
    const unauthorizedError = new HTTPErrorMock(new Response(null, { status: 401 }), {
      success: false,
      code: 'INVALID_INPUT',
      message: '유효하지 않은 토큰입니다.',
    });
    const retryError = new HTTPErrorMock(new Response(null, { status: 500 }), {
      success: false,
      code: 'SERVER_ERROR',
      message: 'server failed',
    });
    const refreshResponse = {
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        accessToken: 'refreshed-access-token',
      },
    };

    useAuthStore.getState().setAccessToken('stale-access-token');
    mockKyRequest
      .mockRejectedValueOnce(unauthorizedError)
      .mockResolvedValueOnce(new Response(JSON.stringify(refreshResponse)))
      .mockRejectedValueOnce(retryError);

    await expect(httpClient.get('/v1/protected')).rejects.toMatchObject({
      message: 'server failed',
      status: 500,
      type: 'server',
    });

    expect(mockKyRequest).toHaveBeenCalledTimes(3);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe('refreshed-access-token');
    expect(useAuthStore.getState().bootstrapStatus).toBe('authenticated');
  });

  it('returns a raw streaming response with authorization options intact', async () => {
    const { httpClient } = await import('./http-client');
    const response = new Response('event: progress\ndata: {}\n\n', {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });

    useAuthStore.getState().setAccessToken('access-token');
    mockKyRequest.mockResolvedValueOnce(response);

    await expect(
      httpClient.stream('/v1/progress', {
        headers: {
          Accept: 'text/event-stream',
        },
        timeout: false,
      }),
    ).resolves.toBe(response);

    expect(mockKyRequest.mock.calls[0]?.[1]).toMatchObject({ timeout: false });
    expect(mockKyRequest.mock.calls[0]?.[1].headers.get('Accept')).toBe('text/event-stream');
    expect(mockKyRequest.mock.calls[0]?.[1].headers.get('Authorization')).toBe(
      'Bearer access-token',
    );
  });
});
