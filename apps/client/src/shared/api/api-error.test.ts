import { describe, expect, it } from 'vitest';

import { ApiError, normalizeApiError } from './api-error';

describe('normalizeApiError', () => {
  it('TypeError를 network 타입의 ApiError로 변환한다', async () => {
    const cause = new TypeError('Failed to fetch');

    const result = await normalizeApiError(cause);

    expect(result).toBeInstanceOf(ApiError);
    expect(result).toMatchObject({
      cause,
      message: 'Failed to fetch',
      type: 'network',
    });
  });
});
