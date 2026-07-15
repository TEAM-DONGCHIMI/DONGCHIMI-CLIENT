import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolvePresignedExcelFileUrl } from './resolve-excel-file-url';

describe('resolvePresignedExcelFileUrl', () => {
  afterEach(() => {
    vi.useRealTimers();
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
        signal: expect.any(AbortSignal),
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
      '파일 업로드에 실패했습니다. 다시 시도해주세요.',
    );
  });

  it('aborts a stalled presigned upload after the timeout', async () => {
    vi.useFakeTimers();

    const file = new File(['name,price'], 'products.csv', { type: 'text/csv' });
    const requestPresignedUploadUrl = vi.fn().mockResolvedValue({
      expiresAt: '2026-07-14T10:00:00.000Z',
      objectKey: 'tmp/products/products.csv',
      requiredHeaders: {},
      uploadUrl: 'https://s3.ap-northeast-2.amazonaws.com/bucket/tmp/products.csv',
    });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      });
    });
    const uploadPromise = resolvePresignedExcelFileUrl(requestPresignedUploadUrl)(file);
    const uploadExpectation = expect(uploadPromise).rejects.toMatchObject({ name: 'AbortError' });

    await vi.advanceTimersByTimeAsync(60_000);
    await uploadExpectation;

    const fetchOptions = fetchSpy.mock.calls[0]?.[1];

    expect(fetchOptions?.signal?.aborted).toBe(true);
  });
});
