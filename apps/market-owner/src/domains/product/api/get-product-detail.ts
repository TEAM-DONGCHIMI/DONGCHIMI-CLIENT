import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export interface GetProductDetailParams {
  marketId: number;
  productId: number;
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
]) satisfies z.ZodType<OwnerApiTypes.OwnerProductDetailResponse['category']>;

const productDetailResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    productId: z.number(),
    name: z.string(),
    dealType: z.enum(['PERIODIC', 'DAILY']),
    thumbnailUrl: z.string().nullable().optional(),
    originalPrice: z.number(),
    discountedPrice: z.number(),
    category: productCategorySchema,
    categoryName: z.string(),
    promotionalPhrase: z.string().nullable().optional(),
    discountStartDate: z.string(),
    discountEndDate: z.string(),
  }),
}) satisfies z.ZodType<OwnerApiTypes.GetDetailData>;

export type GetProductDetailResponseTypes = z.infer<typeof productDetailResponseSchema>;

export const getProductDetail = async ({
  marketId,
  productId,
}: GetProductDetailParams): Promise<GetProductDetailResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.detail(marketId, productId);
  const response = await httpClient.get<unknown>(endpoint);

  return validateApiResponse(productDetailResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner product detail response',
  });
};
