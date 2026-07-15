import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, httpClient } from '@/shared/api';
import type * as SharedApiModule from '@/shared/api';

import { publishLeaflet } from './publish-leaflet';

vi.mock('@/shared/api', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof SharedApiModule;

  return {
    ...actual,
    httpClient: {
      post: vi.fn(),
    },
  };
});

const mockedHttpClientPost = vi.mocked(httpClient.post);

describe('publishLeaflet', () => {
  beforeEach(() => {
    mockedHttpClientPost.mockReset();
  });

  it('publishes the market leaflet and returns its slug', async () => {
    mockedHttpClientPost.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: {
        slug: 'VQ6EAOKbQdSnFkRlVUQAAA',
      },
    });

    await expect(publishLeaflet(12)).resolves.toEqual({
      slug: 'VQ6EAOKbQdSnFkRlVUQAAA',
    });
    expect(mockedHttpClientPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.flyers.publish(12));
  });

  it('rejects a success response without a usable slug', async () => {
    mockedHttpClientPost.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: {
        slug: '',
      },
    });

    await expect(publishLeaflet(12)).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error', async () => {
    const apiError = new ApiError({
      code: 'FORBIDDEN_MARKET_ACCESS',
      message: '해당 마트에 대한 접근 권한이 없습니다.',
      status: 403,
      type: 'auth',
    });

    mockedHttpClientPost.mockRejectedValueOnce(apiError);

    await expect(publishLeaflet(12)).rejects.toBe(apiError);
  });
});
