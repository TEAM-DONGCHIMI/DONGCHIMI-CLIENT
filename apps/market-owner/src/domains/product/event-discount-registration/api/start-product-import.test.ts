import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import type * as SharedApiModule from '@/shared/api';

import { startProductImport } from './start-product-import';

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

describe('startProductImport', () => {
  it('posts excelFileUrl to owner product import endpoint and returns job id', async () => {
    mockedHttpClientPost.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: {
        jobId: 'job-123',
      },
    });

    await expect(
      startProductImport({
        marketId: 12,
        request: {
          excelFileUrl: 'https://static.dongchimi.kr/test.xlsx',
        },
      }),
    ).resolves.toEqual({
      jobId: 'job-123',
    });

    expect(mockedHttpClientPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.products.import(12), {
      json: {
        excelFileUrl: 'https://static.dongchimi.kr/test.xlsx',
      },
    });
  });
});
