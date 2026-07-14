import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from './http-client';
import { ApiError } from './api-error';
import { createPresignedUploadUrl, uploadFileToPresignedUrl } from './presigned-upload';

vi.mock('./http-client', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(httpClient.post);

describe('createPresignedUploadUrl', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('requests a presigned URL and returns the upload contract', async () => {
    const request = {
      purpose: 'PRODUCT_THUMBNAIL',
      contentType: 'image/png',
      contentLength: 1024,
    };
    const data = {
      uploadUrl: 'https://s3.ap-northeast-2.amazonaws.com/bucket/tmp/image.png',
      objectKey: 'tmp/PRODUCT_THUMBNAIL/image.png',
      expiresAt: '2026-07-13T12:00:00.000Z',
      requiredHeaders: {
        'Content-Type': 'image/png',
      },
    };

    mockedPost.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data,
    });

    await expect(createPresignedUploadUrl(request)).resolves.toEqual(data);
    expect(mockedPost).toHaveBeenCalledWith(API_ENDPOINTS.common.uploads.presignedUrl, {
      json: request,
    });
  });

  it('accepts the local OpenAPI date-time returned by the server', async () => {
    const data = {
      uploadUrl: 'https://s3.ap-northeast-2.amazonaws.com/bucket/tmp/image.png',
      objectKey: 'tmp/PRODUCT_THUMBNAIL/image.png',
      expiresAt: '2026-07-14T15:56:38.811782288',
      requiredHeaders: {
        'Content-Type': 'image/png',
      },
    };

    mockedPost.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data,
    });

    await expect(
      createPresignedUploadUrl({
        purpose: 'PRODUCT_THUMBNAIL',
        contentType: 'image/png',
        contentLength: 1024,
      }),
    ).resolves.toEqual(data);
  });

  it('rejects a success response with an invalid upload contract', async () => {
    mockedPost.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: {
        uploadUrl: 'not-a-url',
      },
    });

    await expect(
      createPresignedUploadUrl({
        purpose: 'PRODUCT_THUMBNAIL',
        contentType: 'image/png',
        contentLength: 1024,
      }),
    ).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'FILE_SIZE_EXCEEDED',
      message: '파일 크기가 제한을 초과했습니다.',
      status: 413,
      type: 'client',
    });

    mockedPost.mockRejectedValue(apiError);

    await expect(
      createPresignedUploadUrl({
        purpose: 'PRODUCT_THUMBNAIL',
        contentType: 'image/png',
        contentLength: 11 * 1024 * 1024,
      }),
    ).rejects.toBe(apiError);
  });
});

describe('uploadFileToPresignedUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uploads the file with the required headers returned by the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    const file = new File(['image'], 'product.png', { type: 'image/png' });
    const requiredHeaders = {
      'Content-Type': 'image/png',
      'x-amz-meta-purpose': 'PRODUCT_THUMBNAIL',
    };

    vi.stubGlobal('fetch', fetchMock);

    await uploadFileToPresignedUrl({
      file,
      requiredHeaders,
      uploadUrl: 'https://s3.example.com/tmp/product.png?signature=temporary',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://s3.example.com/tmp/product.png?signature=temporary',
      {
        body: file,
        headers: requiredHeaders,
        method: 'PUT',
      },
    );
  });

  it('rejects an unsuccessful storage response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));

    await expect(
      uploadFileToPresignedUrl({
        file: new File(['image'], 'product.png', { type: 'image/png' }),
        requiredHeaders: { 'Content-Type': 'image/png' },
        uploadUrl: 'https://s3.example.com/tmp/product.png?signature=expired',
      }),
    ).rejects.toThrow('Presigned upload failed with status 403.');
  });
});
