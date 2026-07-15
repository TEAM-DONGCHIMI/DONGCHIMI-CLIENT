import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { ownerHomeFixture } from '../fixtures/owner-home-api.fixture';

import { getOwnerHome } from './get-owner-home';

vi.mock('@/shared/api', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(httpClient.get);

describe('getOwnerHome', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('requests the owner home endpoint and returns the validated response data', async () => {
    mockedGet.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: ownerHomeFixture,
    });

    await expect(getOwnerHome()).resolves.toEqual(ownerHomeFixture);
    expect(mockedGet).toHaveBeenCalledWith(API_ENDPOINTS.owner.home);
  });

  it('rejects an invalid success response contract', async () => {
    mockedGet.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: {
        dailyCount: 1,
      },
    });

    await expect(getOwnerHome()).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'UNAUTHORIZED',
      message: '인증이 필요합니다.',
      status: 401,
      type: 'auth',
    });

    mockedGet.mockRejectedValue(apiError);

    await expect(getOwnerHome()).rejects.toBe(apiError);
  });
});
