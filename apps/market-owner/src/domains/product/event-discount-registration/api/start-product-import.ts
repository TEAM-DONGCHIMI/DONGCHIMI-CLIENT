import {
  API_ENDPOINTS,
  type ApiPathParamTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type ProductImportRequestTypes = OwnerApiTypes.ProductImportRequest;
export type ProductImportResponseTypes = OwnerApiTypes.ProductImportResponse;
type ProductImportApiResponseTypes = OwnerApiTypes.ApiResponseProductImportResponse;

const productImportResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
  data: z.object({
    jobId: z.string(),
  }),
}) satisfies z.ZodType<ProductImportApiResponseTypes>;

export interface StartProductImportParams {
  marketId: ApiPathParamTypes;
  request: ProductImportRequestTypes;
}

export const startProductImport = async ({
  marketId,
  request,
}: StartProductImportParams): Promise<ProductImportResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.import(marketId);
  const response = await httpClient.post<unknown>(endpoint, {
    json: request,
  });
  const validatedResponse = validateApiResponse(productImportResponseSchema, response, {
    endpoint,
    schemaDescription: 'ProductImportResponse',
  });

  return validatedResponse.data;
};
