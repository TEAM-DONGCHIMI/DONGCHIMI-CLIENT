import { API_ENDPOINTS, ApiResponseValidationError } from '@dongchimi/shared/api';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';

import { loginMarketOwner } from './auth-api';

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
