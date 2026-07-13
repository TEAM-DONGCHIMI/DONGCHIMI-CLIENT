import { z } from '@dongchimi/shared/api';

export const authRefreshResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
  }),
});

export type AuthRefreshResponseTypes = z.infer<typeof authRefreshResponseSchema>;
