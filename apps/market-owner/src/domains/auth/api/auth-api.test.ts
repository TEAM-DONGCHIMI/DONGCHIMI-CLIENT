import { API_ENDPOINTS, ApiResponseValidationError } from '@dongchimi/shared/api';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';

import { loginMarketOwner, refreshMarketOwnerAuth, signupMarketOwner } from './auth-api';

vi.mock('@/shared/api', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const mockHttpPost = vi.mocked(httpClient.post);

describe('loginMarketOwner', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('posts owner login request with cookie credentials and returns validated response', async () => {
    mockHttpPost.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        accessToken: 'access-token',
        ownerId: 1,
        email: 'owner@example.com',
        marketId: 10,
        marketName: 'Fresh Market',
        marketThumbnailUrl: 'https://cdn.test/market.png',
      },
    });

    const result = await loginMarketOwner({
      email: 'owner@example.com',
      isAutoLogin: true,
      password: 'password123!',
    });

    expect(mockHttpPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.auth.login, {
      auth: {
        skipAuthorization: true,
        skipRefresh: true,
      },
      credentials: 'include',
      json: {
        email: 'owner@example.com',
        isAutoLogin: true,
        password: 'password123!',
      },
    });
    expect(result.data.accessToken).toBe('access-token');
  });

  it('throws response validation error when login response contract is invalid', async () => {
    mockHttpPost.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: null,
    });

    await expect(
      loginMarketOwner({
        email: 'owner@example.com',
        isAutoLogin: false,
        password: 'password123!',
      }),
    ).rejects.toThrow(ApiResponseValidationError);
  });
});

describe('signupMarketOwner', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('posts owner signup request to the shared endpoint and returns validated response', async () => {
    const response = {
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        ownerId: 1,
        email: 'owner@example.com',
      },
    };
    const requestBody = {
      email: 'owner@example.com',
      password: 'password123!',
    };

    mockHttpPost.mockResolvedValueOnce(response);

    await expect(signupMarketOwner(requestBody)).resolves.toEqual(response);
    expect(mockHttpPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.auth.signup, {
      auth: {
        skipAuthorization: true,
        skipRefresh: true,
      },
      json: requestBody,
    });
  });

  it('throws when the signup response does not match the API contract', async () => {
    mockHttpPost.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        ownerId: '1',
        email: 'owner@example.com',
      },
    });

    await expect(
      signupMarketOwner({
        email: 'owner@example.com',
        password: 'password123!',
      }),
    ).rejects.toBeInstanceOf(ApiResponseValidationError);
  });
});

describe('refreshMarketOwnerAuth', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('posts refresh request with cookie credentials and returns validated access token', async () => {
    const response = {
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {
        accessToken: 'refreshed-access-token',
      },
    };

    mockHttpPost.mockResolvedValueOnce(response);

    await expect(refreshMarketOwnerAuth()).resolves.toEqual(response);
    expect(mockHttpPost).toHaveBeenCalledWith(API_ENDPOINTS.common.auth.refresh, {
      auth: {
        skipAuthorization: true,
        skipRefresh: true,
      },
      credentials: 'include',
    });
  });

  it('throws when the refresh response does not match the API contract', async () => {
    mockHttpPost.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: 'ok',
      data: {},
    });

    await expect(refreshMarketOwnerAuth()).rejects.toBeInstanceOf(ApiResponseValidationError);
  });
});
