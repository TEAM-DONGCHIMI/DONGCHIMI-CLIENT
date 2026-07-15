import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type DeleteProductResponseTypes = OwnerApiTypes.DeleteData;
export type DeleteProductRequestTypes = OwnerApiTypes.ProductDeleteRequest;
export type DeleteProductsRequestTypes = OwnerApiTypes.ProductBulkDeleteRequest;

export interface DeleteProductParams {
  marketId: number;
  productId: number;
  request: DeleteProductRequestTypes;
}

export interface DeleteProductsParams {
  marketId: number;
  request: DeleteProductsRequestTypes;
}

const deleteProductResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
}) satisfies z.ZodType<DeleteProductResponseTypes>;

const validateDeleteProductResponse = (endpoint: string, response: unknown) => {
  return validateApiResponse(deleteProductResponseSchema, response, {
    endpoint,
    schemaDescription: 'Product deletion response',
  });
};

export const deleteProduct = async ({
  marketId,
  productId,
  request,
}: DeleteProductParams): Promise<DeleteProductResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.detail(marketId, productId);
  const response = await httpClient.delete<unknown>(endpoint, {
    json: request,
  });

  return validateDeleteProductResponse(endpoint, response);
};

export const deleteProducts = async ({
  marketId,
  request,
}: DeleteProductsParams): Promise<DeleteProductResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.collection(marketId);
  const response = await httpClient.delete<unknown>(endpoint, {
    json: request,
  });

  return validateDeleteProductResponse(endpoint, response);
};
