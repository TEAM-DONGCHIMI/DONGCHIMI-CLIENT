import { z } from '@dongchimi/shared/api';

const marketBusinessHourSchema = z.object({
  days: z.array(z.string()),
  isOpen: z.boolean(),
  open: z.string().nullable().optional(),
  close: z.string().nullable().optional(),
});

export const ownerMarketDetailResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    marketId: z.number().int(),
    name: z.string(),
    thumbnailUrl: z.string().nullable().optional(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    businessHours: z.array(marketBusinessHourSchema),
    isHolidayClosed: z.boolean(),
    marketPhone1: z.string(),
    marketPhone2: z.string().nullable().optional(),
    marketPhonePrimary: z.number().int(),
    ownerPhone: z.string(),
    brn: z.string().nullable().optional(),
  }),
});

export type OwnerMarketDetailTypes = z.infer<typeof ownerMarketDetailResponseSchema>['data'];
