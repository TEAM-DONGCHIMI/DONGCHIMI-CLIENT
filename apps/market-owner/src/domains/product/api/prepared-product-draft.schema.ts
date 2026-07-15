import { z } from '@dongchimi/shared/api';

import type { OwnerApiTypes } from '@/shared/api';

export type PreparedProductDraftCategoryCodeTypes = NonNullable<
  OwnerApiTypes.OwnerPreparedProductDraftResponse['category']
>;

export interface PreparedProductDraftSearchParamsTypes {
  categories?: readonly PreparedProductDraftCategoryCodeTypes[];
  page?: number;
  search?: string;
  size?: number;
}

export type OwnerPreparedProductDraftResponseTypes = Omit<
  OwnerApiTypes.OwnerPreparedProductDraftResponse,
  'category' | 'failReason'
> & {
  category?: PreparedProductDraftCategoryCodeTypes | null;
  failReason?: string | null;
};

export type OwnerPreparedProductDraftListResponseTypes = Omit<
  OwnerApiTypes.OwnerPreparedProductDraftListResponse,
  'preparedProducts'
> & {
  preparedProducts: OwnerPreparedProductDraftResponseTypes[];
};

export type GetPreparedProductDraftsResponseTypes = Omit<OwnerApiTypes.GetDraftsData, 'data'> & {
  data: OwnerPreparedProductDraftListResponseTypes;
};

export const preparedProductDraftCategorySchema = z.enum([
  'VEGETABLE_FRUIT',
  'MEAT_EGG',
  'SEAFOOD',
  'DAIRY',
  'CONVENIENCE_FOOD',
  'PROCESSED_FOOD',
  'BEVERAGE_ALCOHOL',
  'HOUSEHOLD_GOODS',
  'ETC',
]) satisfies z.ZodType<PreparedProductDraftCategoryCodeTypes>;

export const ownerPreparedProductDraftResponseSchema = z.object({
  preparedProductId: z.number(),
  name: z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  discountedPrice: z.number().nullable().optional(),
  category: preparedProductDraftCategorySchema.nullable().optional(),
  promotionalPhrase: z.string().nullable().optional(),
  discountStartDate: z.string().nullable().optional(),
  discountEndDate: z.string().nullable().optional(),
  draftStatus: z.enum(['SUCCESS', 'FAIL']),
  failReason: z.string().nullable().optional(),
}) satisfies z.ZodType<OwnerPreparedProductDraftResponseTypes>;
