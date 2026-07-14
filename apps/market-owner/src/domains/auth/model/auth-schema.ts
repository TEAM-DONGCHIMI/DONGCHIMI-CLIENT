import { z } from '@dongchimi/shared/api';

import type { OwnerApiTypes } from '@/shared/api';

export type OwnerSignupResponseTypes = OwnerApiTypes.ApiResponseOwnerSignupResponse;

export const ownerSignupResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    ownerId: z.number(),
    email: z.string(),
  }),
}) satisfies z.ZodType<OwnerSignupResponseTypes>;
