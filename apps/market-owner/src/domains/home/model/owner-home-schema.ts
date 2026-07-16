import { type OwnerApiTypes } from '@/shared/api';
import { z } from '@dongchimi/shared/api';

type OwnerHomeApiResponseTypes = OwnerApiTypes.ApiResponseOwnerHomeResponse;

const absoluteOrRootRelativeUrlSchema = z.union([
  z.url(),
  z.string().regex(/^\/(?!\/)/, 'Expected an absolute URL or root-relative path'),
]);

const homeProductSchema = z.object({
  productId: z.number().int(),
  thumbnailUrl: absoluteOrRootRelativeUrlSchema.nullable().optional(),
  name: z.string(),
  originalPrice: z.number(),
  discountedPrice: z.number(),
  discountRate: z.number().int(),
});

const homeFlyerSchema = z.object({
  flyerId: z.number().int(),
  slug: z.string().min(1),
  qrCode: z.string().nullable().optional(),
});

export const ownerHomeResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    todayRegisteredCount: z.number().int(),
    dailyCount: z.number().int(),
    dailyProducts: z.array(homeProductSchema),
    periodicCount: z.number().int(),
    periodicProducts: z.array(homeProductSchema),
    flyer: homeFlyerSchema.nullable().optional(),
  }),
}) satisfies z.ZodType<OwnerHomeApiResponseTypes>;

export type OwnerHomeResponseTypes = z.infer<typeof ownerHomeResponseSchema>['data'];
