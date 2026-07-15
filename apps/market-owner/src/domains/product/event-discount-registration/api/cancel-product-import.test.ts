import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import type * as SharedApiModule from '@/shared/api';

import { cancelProductImport } from './cancel-product-import';

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

describe('cancelProductImport', () => {
  it('posts to the product import cancel endpoint', async () => {
    mockedHttpClientPost.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });

    await expect(cancelProductImport({ jobId: 'job-123', marketId: 12 })).resolves.toBeUndefined();

    expect(mockedHttpClientPost).toHaveBeenCalledWith(
      API_ENDPOINTS.owner.products.importCancel(12, 'job-123'),
    );
  });

  it('rejects a failed API envelope', async () => {
    mockedHttpClientPost.mockResolvedValueOnce({
      success: false,
      code: 'JOB_NOT_FOUND',
      message: '존재하지 않는 분석 작업입니다.',
    });

    await expect(cancelProductImport({ jobId: 'job-123', marketId: 12 })).rejects.toSatisfy(
      isApiResponseValidationError,
    );
  });
});
