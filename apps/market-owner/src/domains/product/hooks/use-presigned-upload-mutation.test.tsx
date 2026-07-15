import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPresignedUploadUrl } from '@/shared/api';
import { PRESIGNED_UPLOAD_PURPOSE } from '@/shared/constants/presigned-upload-purpose';

import { usePresignedUploadMutation } from './use-presigned-upload-mutation';

vi.mock('@/shared/api', () => {
  return {
    createPresignedUploadUrl: vi.fn(),
  };
});

const mockedCreatePresignedUploadUrl = vi.mocked(createPresignedUploadUrl);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return TestQueryProvider;
};

describe('usePresignedUploadMutation', () => {
  beforeEach(() => {
    mockedCreatePresignedUploadUrl.mockReset();
  });

  it('passes the file metadata to the API helper and returns the upload contract', async () => {
    const request = {
      purpose: PRESIGNED_UPLOAD_PURPOSE.PRODUCT_THUMBNAIL,
      contentType: 'image/png',
      contentLength: 1024,
    };
    const response = {
      uploadUrl: 'https://s3.ap-northeast-2.amazonaws.com/bucket/tmp/image.png',
      objectKey: 'tmp/PRODUCT_THUMBNAIL/image.png',
      expiresAt: '2026-07-14T12:00:00.000Z',
      requiredHeaders: {
        'Content-Type': 'image/png',
      },
    };

    mockedCreatePresignedUploadUrl.mockResolvedValue(response);

    const { result } = renderHook(() => usePresignedUploadMutation(), {
      wrapper: createWrapper(),
    });

    await expect(
      act(async () => {
        return result.current.mutateAsync(request);
      }),
    ).resolves.toEqual(response);
    expect(mockedCreatePresignedUploadUrl).toHaveBeenCalledWith(request);
  });
});
