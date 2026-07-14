import { z } from '@dongchimi/shared/api';

import type { OwnerApiTypes } from '@/shared/api';

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
  }) satisfies z.ZodType<OwnerApiTypes.OwnerLoginResponse>,
) satisfies z.ZodType<OwnerApiTypes.LoginData>;

export const ownerSignupResponseSchema = createOwnerAuthSuccessResponseSchema(
  z.object({
    ownerId: z.number(),
    email: z.string(),
  }) satisfies z.ZodType<OwnerApiTypes.OwnerSignupResponse>,
) satisfies z.ZodType<OwnerApiTypes.SignupData>;

export type OwnerLoginResponseTypes = z.infer<typeof ownerLoginResponseSchema>;
export type OwnerSignupResponseTypes = z.infer<typeof ownerSignupResponseSchema>;
