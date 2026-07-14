import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPresignedUploadUrl, uploadFileToPresignedUrl } from '@/shared/api';

import { useMarketThumbnailUploadMutation } from './use-market-thumbnail-upload-mutation';

vi.mock('@/shared/api', () => ({
  createPresignedUploadUrl: vi.fn(),
  uploadFileToPresignedUrl: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return TestQueryProvider;
};

describe('useMarketThumbnailUploadMutation', () => {
  beforeEach(() => {
    vi.mocked(createPresignedUploadUrl).mockReset();
    vi.mocked(uploadFileToPresignedUrl).mockReset();
  });

  it('uploads the market thumbnail and returns its object key', async () => {
    const file = new File(['image'], 'market.png', { type: 'image/png' });
    const uploadContract = {
      expiresAt: '2026-07-15T01:46:50.857906828',
      objectKey: 'tmp/MARKET_THUMBNAIL/market.png',
      requiredHeaders: { 'Content-Type': 'image/png' },
      uploadUrl: 'https://s3.example.com/upload',
    };

    vi.mocked(createPresignedUploadUrl).mockResolvedValue(uploadContract);
    vi.mocked(uploadFileToPresignedUrl).mockResolvedValue();

    const { result } = renderHook(() => useMarketThumbnailUploadMutation(), {
      wrapper: createWrapper(),
    });

    await expect(act(async () => result.current.mutateAsync(file))).resolves.toBe(
      uploadContract.objectKey,
    );
    expect(createPresignedUploadUrl).toHaveBeenCalledWith({
      contentLength: file.size,
      contentType: file.type,
      purpose: 'MARKET_THUMBNAIL',
    });
    expect(uploadFileToPresignedUrl).toHaveBeenCalledWith({
      file,
      requiredHeaders: uploadContract.requiredHeaders,
      uploadUrl: uploadContract.uploadUrl,
    });
  });
});
