import { validateApiResponse, z } from '@dongchimi/shared/api';
import { describe, expect, it, vi } from 'vitest';

import { createQueryClient } from './query-client';

describe('createQueryClient', () => {
  it('API 응답 검증 오류는 자동 재시도하지 않는다', async () => {
    const queryClient = createQueryClient();
    const queryFn = vi.fn(async () => {
      return validateApiResponse(z.object({ success: z.literal(true) }), { success: false });
    });

    await expect(
      queryClient.fetchQuery({
        queryFn,
        queryKey: ['invalid-api-response'],
      }),
    ).rejects.toMatchObject({ name: 'ApiResponseValidationError' });
    expect(queryFn).toHaveBeenCalledOnce();
  });
});
