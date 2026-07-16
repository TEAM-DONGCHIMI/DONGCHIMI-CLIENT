import {
  API_ENDPOINTS,
  type OwnerProductListTypeTypes,
  type OwnerProductSortTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type GetProductListResponseTypes = OwnerApiTypes.GetProductsData;

export interface GetProductListParams {
  cursor?: number;
  marketId: number;
  size?: number;
  sort?: OwnerProductSortTypes;
  type: OwnerProductListTypeTypes;
}

const productCategorySchema = z.enum([
  'VEGETABLE_FRUIT',
  'MEAT_EGG',
  'SEAFOOD',
  'DAIRY',
  'CONVENIENCE_FOOD',
  'PROCESSED_FOOD',
  'BEVERAGE_ALCOHOL',
  'HOUSEHOLD_GOODS',
  'ETC',
]) satisfies z.ZodType<OwnerApiTypes.OwnerProductListItemResponse['category']>;

const ownerProductListItemResponseSchema = z.object({
  productId: z.number(),
  name: z.string(),
  thumbnailUrl: z.string().nullable().optional(),
  category: productCategorySchema,
  categoryName: z.string(),
  originalPrice: z.number(),
  discountedPrice: z.number(),
  promotionalPhrase: z.string().nullable().optional(),
  discountStartDate: z.string(),
  discountEndDate: z.string(),
  viewCount: z.number(),
  createdAt: z.string(),
}) satisfies z.ZodType<OwnerApiTypes.OwnerProductListItemResponse>;

const getProductListResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    content: z.array(ownerProductListItemResponseSchema),
    hasNext: z.boolean(),
    nextCursor: z.number().nullable().optional(),
  }),
}) satisfies z.ZodType<GetProductListResponseTypes>;

export const getProductList = async ({
  cursor,
  marketId,
  size,
  sort = 'CATEGORY',
  type,
}: GetProductListParams): Promise<GetProductListResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.collection(marketId, {
    cursor,
    size,
    sort,
    type,
  });
  const response = await httpClient.get<unknown>(endpoint);

  return validateApiResponse(getProductListResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner product list response',
  });
};
