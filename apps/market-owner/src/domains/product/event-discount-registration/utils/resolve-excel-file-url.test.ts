import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolvePresignedExcelFileUrl } from './resolve-excel-file-url';

describe('resolvePresignedExcelFileUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests a presigned URL, uploads the excel file, and returns objectKey', async () => {
    const file = new File(['name,price'], 'products.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const requestPresignedUploadUrl = vi.fn().mockResolvedValue({
      expiresAt: '2026-07-14T10:00:00.000Z',
      objectKey: 'tmp/products/products.xlsx',
      requiredHeaders: {
        'Content-Type': file.type,
      },
      uploadUrl: 'https://s3.ap-northeast-2.amazonaws.com/bucket/tmp/products.xlsx',
    });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 200,
      }),
    );

    await expect(resolvePresignedExcelFileUrl(requestPresignedUploadUrl)(file)).resolves.toBe(
      'tmp/products/products.xlsx',
    );

    expect(requestPresignedUploadUrl).toHaveBeenCalledWith({
      contentLength: file.size,
      contentType: file.type,
      purpose: 'product_import',
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://s3.ap-northeast-2.amazonaws.com/bucket/tmp/products.xlsx',
      {
        body: file,
        headers: {
          'Content-Type': file.type,
        },
        method: 'PUT',
      },
    );
  });

  it('throws when the presigned upload request fails', async () => {
    const file = new File(['name,price'], 'products.csv', { type: 'text/csv' });
    const requestPresignedUploadUrl = vi.fn().mockResolvedValue({
      expiresAt: '2026-07-14T10:00:00.000Z',
      objectKey: 'tmp/products/products.csv',
      requiredHeaders: {},
      uploadUrl: 'https://s3.ap-northeast-2.amazonaws.com/bucket/tmp/products.csv',
    });

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 500,
      }),
    );

    await expect(resolvePresignedExcelFileUrl(requestPresignedUploadUrl)(file)).rejects.toThrow(
      'Failed to upload file to presigned URL.',
    );
  });
});
