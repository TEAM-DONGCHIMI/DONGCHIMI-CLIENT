import { afterEach, describe, expect, it, vi } from 'vitest';

import { PRESIGNED_UPLOAD_PURPOSE } from '@/shared/constants/presigned-upload-purpose';

import { resolvePresignedProductImageFileObjectKey } from './resolve-product-image-file-url';

describe('resolvePresignedProductImageFileObjectKey', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uploads the image with the presigned URL and returns the object key', async () => {
    const file = new File(['image'], 'product.png', { type: 'image/png' });
    const requestPresignedUploadUrl = vi.fn().mockResolvedValue({
      expiresAt: '2026-07-16T10:00:00.000Z',
      objectKey: 'tmp/PRODUCT_THUMBNAIL/product.png',
      requiredHeaders: { 'Content-Type': file.type },
      uploadUrl: 'https://s3.ap-northeast-2.amazonaws.com/bucket/product.png',
    });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 200,
      }),
    );

    await expect(
      resolvePresignedProductImageFileObjectKey(requestPresignedUploadUrl)(file),
    ).resolves.toBe('tmp/PRODUCT_THUMBNAIL/product.png');

    expect(requestPresignedUploadUrl).toHaveBeenCalledWith({
      contentLength: file.size,
      contentType: file.type,
      purpose: PRESIGNED_UPLOAD_PURPOSE.PRODUCT_THUMBNAIL,
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://s3.ap-northeast-2.amazonaws.com/bucket/product.png',
      {
        body: file,
        headers: { 'Content-Type': file.type },
        method: 'PUT',
      },
    );
  });
});
