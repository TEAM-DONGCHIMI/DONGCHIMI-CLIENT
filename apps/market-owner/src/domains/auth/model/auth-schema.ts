import { z } from '@dongchimi/shared/api';

export const ownerLoginResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    ownerId: z.number(),
    email: z.string(),
    marketId: z.number().nullable().optional(),
    marketName: z.string().nullable().optional(),
    marketThumbnailUrl: z.string().nullable().optional(),
  }),
});

export type OwnerLoginResponseTypes = z.infer<typeof ownerLoginResponseSchema>;
