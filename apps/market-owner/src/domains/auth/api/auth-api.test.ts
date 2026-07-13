import { API_ENDPOINTS, ApiResponseValidationError } from '@dongchimi/shared/api';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';

import { signupMarketOwner } from './auth-api';

vi.mock('@/shared/api', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const mockPost = vi.mocked(httpClient.post);

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

    mockPost.mockResolvedValue(response);

    await expect(signupMarketOwner(requestBody)).resolves.toEqual(response);
    expect(mockPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.auth.signup, {
      json: requestBody,
    });
  });

  it('throws when the signup response does not match the API contract', async () => {
    mockPost.mockResolvedValue({
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
