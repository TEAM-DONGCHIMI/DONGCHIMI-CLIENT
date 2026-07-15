import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type UpdateProductDiscountPeriodRequestTypes =
  OwnerApiTypes.ProductDiscountPeriodUpdateRequest;

export interface UpdateProductDiscountPeriodParams {
  marketId: number;
  request: UpdateProductDiscountPeriodRequestTypes;
}

export type UpdateProductDiscountPeriodResponseTypes = OwnerApiTypes.UpdateProductData;

const updateProductDiscountPeriodResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
}) satisfies z.ZodType<UpdateProductDiscountPeriodResponseTypes>;

export const updateProductDiscountPeriod = async ({
  marketId,
  request,
}: UpdateProductDiscountPeriodParams): Promise<UpdateProductDiscountPeriodResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.discountPeriod(marketId);
  const response = await httpClient.patch<unknown>(endpoint, { json: request });

  return validateApiResponse(updateProductDiscountPeriodResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner product discount period update response',
  });
};
