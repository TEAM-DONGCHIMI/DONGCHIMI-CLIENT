import { API_ENDPOINTS, isApiResponseValidationError } from '@dongchimi/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/shared/api';
import { ApiError } from '@/shared/api/api-error';

import { issueQrCode } from './issue-qr-code';

vi.mock('@/shared/api', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(httpClient.post);

describe('issueQrCode', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('issues the QR code for the market and returns its data', async () => {
    mockedPost.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: { qrCode: 'base64-qr-code' },
    });

    await expect(issueQrCode(1)).resolves.toEqual({ qrCode: 'base64-qr-code' });
    expect(mockedPost).toHaveBeenCalledWith(API_ENDPOINTS.owner.flyers.qr(1));
  });

  it('rejects an empty QR code response', async () => {
    mockedPost.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: { qrCode: '' },
    });

    await expect(issueQrCode(1)).rejects.toSatisfy(isApiResponseValidationError);
  });

  it('does not swallow an API error from the HTTP client', async () => {
    const apiError = new ApiError({
      code: 'FORBIDDEN_MARKET_ACCESS',
      message: '해당 마트에 대한 접근 권한이 없습니다.',
      status: 403,
      type: 'auth',
    });
    mockedPost.mockRejectedValue(apiError);

    await expect(issueQrCode(1)).rejects.toBe(apiError);
  });
});
