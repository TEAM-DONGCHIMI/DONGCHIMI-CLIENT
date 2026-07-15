import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/shared/query';
import { createPresignedUploadUrl, uploadFileToPresignedUrl } from '@/shared/api';

import { useProductThumbnailUpload } from './use-product-thumbnail-upload';

vi.mock('@/shared/api', async (importOriginal) => ({
  ...(await importOriginal()),
  createPresignedUploadUrl: vi.fn(),
  uploadFileToPresignedUrl: vi.fn(),
}));

const mockedCreatePresignedUploadUrl = vi.mocked(createPresignedUploadUrl);
const mockedUploadFileToPresignedUrl = vi.mocked(uploadFileToPresignedUrl);

const createWrapper = (queryClient: QueryClient) => {
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return TestQueryProvider;
};

describe('useProductThumbnailUpload', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    mockedCreatePresignedUploadUrl.mockReset();
    mockedUploadFileToPresignedUrl.mockReset();
  });

  it('uploads a product image and returns its public S3 URL', async () => {
    vi.stubEnv('VITE_PUBLIC_S3_BASE_URL', 'https://static.dongchimi.kr/');
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });
    mockedCreatePresignedUploadUrl.mockResolvedValue({
      uploadUrl: 'https://upload.example.com/product.png',
      objectKey: '/tmp/PRODUCT_THUMBNAIL/product.png',
      expiresAt: '2026-07-15T10:00:00+09:00',
      requiredHeaders: { 'Content-Type': 'image/png' },
    });
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useProductThumbnailUpload(), {
      wrapper: createWrapper(queryClient),
    });
    let thumbnailUrl = '';

    await act(async () => {
      thumbnailUrl = await result.current.uploadProductThumbnail(imageFile);
    });

    expect(mockedCreatePresignedUploadUrl).toHaveBeenCalledWith({
      contentLength: imageFile.size,
      contentType: 'image/png',
      purpose: 'PRODUCT_THUMBNAIL',
    });
    expect(mockedUploadFileToPresignedUrl).toHaveBeenCalledWith({
      file: imageFile,
      requiredHeaders: { 'Content-Type': 'image/png' },
      uploadUrl: 'https://upload.example.com/product.png',
    });
    expect(thumbnailUrl).toBe('https://static.dongchimi.kr/tmp/PRODUCT_THUMBNAIL/product.png');
  });
});
