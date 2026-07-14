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
    expect(mockKyRequest.mock.calls[1]?.[0]).toBe('/v1/auth/refresh');
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
});
