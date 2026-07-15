import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type GetProductSearchResponseTypes = OwnerApiTypes.SearchData;

export interface GetProductSearchParams {
  keyword: string;
  marketId: number;
  size?: number;
}

const DEFAULT_PRODUCT_SEARCH_SIZE = 10;

const productSearchItemResponseSchema = z.object({
  productId: z.number(),
  name: z.string(),
  dealType: z.enum(['PERIODIC', 'DAILY']),
}) satisfies z.ZodType<OwnerApiTypes.ProductSearchItemResponse>;

const getProductSearchResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    products: z.array(productSearchItemResponseSchema),
  }),
}) satisfies z.ZodType<GetProductSearchResponseTypes>;

export const getProductSearch = async ({
  keyword,
  marketId,
  size = DEFAULT_PRODUCT_SEARCH_SIZE,
}: GetProductSearchParams): Promise<GetProductSearchResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.search(marketId, {
    keyword: keyword.trim(),
    size,
  });
  const response = await httpClient.get<unknown>(endpoint);

  return validateApiResponse(getProductSearchResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner product search response',
  });
};
