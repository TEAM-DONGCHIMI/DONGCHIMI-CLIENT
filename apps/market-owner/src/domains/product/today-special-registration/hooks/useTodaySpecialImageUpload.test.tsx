import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { uploadFileToPresignedUrl } from '@/shared/api';

import { usePresignedUploadMutation } from '../../hooks';
import { createEmptyTodaySpecialProductForm } from '../model';
import { useTodaySpecialImageUpload } from './useTodaySpecialImageUpload';

vi.mock('@/shared/api', () => ({
  uploadFileToPresignedUrl: vi.fn(),
}));

vi.mock('../../hooks', () => ({
  usePresignedUploadMutation: vi.fn(),
}));

const mockedUploadFileToPresignedUrl = vi.mocked(uploadFileToPresignedUrl);
const mockedUsePresignedUploadMutation = vi.mocked(usePresignedUploadMutation);
const createPresignedUploadUrl = vi.fn();

describe('useTodaySpecialImageUpload', () => {
  beforeEach(() => {
    createPresignedUploadUrl.mockReset();
    mockedUploadFileToPresignedUrl.mockReset();
    mockedUsePresignedUploadMutation.mockReturnValue({
      mutateAsync: createPresignedUploadUrl,
    } as never);
  });

  it('uploads a selected image and returns its object key', async () => {
    const file = new File(['image'], 'product.png', { type: 'image/png' });
    const uploadContract = {
      uploadUrl: 'https://s3.example.com/tmp/product.png?signature=temporary',
      objectKey: 'tmp/PRODUCT_THUMBNAIL/product.png',
      expiresAt: '2026-07-14T12:00:00.000Z',
      requiredHeaders: {
        'Content-Type': 'image/png',
      },
    };
    const product = {
      ...createEmptyTodaySpecialProductForm(),
      imageFile: file,
    };

    createPresignedUploadUrl.mockResolvedValue(uploadContract);
    mockedUploadFileToPresignedUrl.mockResolvedValue();

    const { result } = renderHook(() => useTodaySpecialImageUpload());

    await expect(
      act(async () => {
        return result.current.uploadProductImage(product);
      }),
    ).resolves.toBe('tmp/PRODUCT_THUMBNAIL/product.png');
    expect(createPresignedUploadUrl).toHaveBeenCalledWith({
      contentLength: file.size,
      contentType: 'image/png',
      purpose: 'PRODUCT_THUMBNAIL',
    });
    expect(mockedUploadFileToPresignedUrl).toHaveBeenCalledWith({
      file,
      requiredHeaders: uploadContract.requiredHeaders,
      uploadUrl: uploadContract.uploadUrl,
    });
  });

  it('returns null without requesting a Presigned URL when there is no image', async () => {
    const { result } = renderHook(() => useTodaySpecialImageUpload());

    await expect(
      act(async () => {
        return result.current.uploadProductImage(createEmptyTodaySpecialProductForm());
      }),
    ).resolves.toBeNull();
    expect(createPresignedUploadUrl).not.toHaveBeenCalled();
    expect(mockedUploadFileToPresignedUrl).not.toHaveBeenCalled();
  });

  it('exposes an S3 upload failure to the form submit flow', async () => {
    const file = new File(['image'], 'product.png', { type: 'image/png' });

    createPresignedUploadUrl.mockResolvedValue({
      uploadUrl: 'https://s3.example.com/tmp/product.png?signature=expired',
      objectKey: 'tmp/PRODUCT_THUMBNAIL/product.png',
      expiresAt: '2026-07-14T12:00:00.000Z',
      requiredHeaders: { 'Content-Type': 'image/png' },
    });
    mockedUploadFileToPresignedUrl.mockRejectedValue(new Error('S3 upload failed'));

    const { result } = renderHook(() => useTodaySpecialImageUpload());

    await expect(
      act(async () => {
        return result.current.uploadProductImage({
          ...createEmptyTodaySpecialProductForm(),
          imageFile: file,
        });
      }),
    ).rejects.toThrow('S3 upload failed');
  });
});
