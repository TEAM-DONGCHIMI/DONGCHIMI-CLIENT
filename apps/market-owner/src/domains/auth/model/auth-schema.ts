import { z } from '@dongchimi/shared/api';

export const ownerSignupResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    ownerId: z.number(),
    email: z.string(),
  }),
});

export type OwnerSignupResponseTypes = z.infer<typeof ownerSignupResponseSchema>;
