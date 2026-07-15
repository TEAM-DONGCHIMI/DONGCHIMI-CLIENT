import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type UpdateProductRequestTypes = OwnerApiTypes.ProductUpdateRequest;
export type UpdateProductResponseTypes = OwnerApiTypes.UpdateProductData;

export interface UpdateProductParams {
  marketId: number;
  productId: number;
  request: UpdateProductRequestTypes;
}

const updateProductResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
}) satisfies z.ZodType<UpdateProductResponseTypes>;

export const updateProduct = async ({
  marketId,
  productId,
  request,
}: UpdateProductParams): Promise<UpdateProductResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.detail(marketId, productId);
  const response = await httpClient.put<unknown>(endpoint, { json: request });

  return validateApiResponse(updateProductResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner product update response',
  });
};
