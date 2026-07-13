import { z } from '@dongchimi/shared/api';

const createOwnerAuthSuccessResponseSchema = <DataSchemaTypes extends z.ZodType>(
  dataSchema: DataSchemaTypes,
) =>
  z.object({
    success: z.literal(true),
    code: z.literal('SUCCESS'),
    message: z.string(),
    data: dataSchema,
  });

export const ownerLoginResponseSchema = createOwnerAuthSuccessResponseSchema(
  z.object({
    accessToken: z.string(),
    ownerId: z.number(),
    email: z.string(),
    marketId: z.number().nullable().optional(),
    marketName: z.string().nullable().optional(),
    marketThumbnailUrl: z.string().nullable().optional(),
  }),
);

export const ownerSignupResponseSchema = createOwnerAuthSuccessResponseSchema(
  z.object({
    ownerId: z.number(),
    email: z.string(),
  }),
);

export type OwnerLoginResponseTypes = z.infer<typeof ownerLoginResponseSchema>;
export type OwnerSignupResponseTypes = z.infer<typeof ownerSignupResponseSchema>;
