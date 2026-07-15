import {
  API_ENDPOINTS,
  type ApiPathParamTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

type CancelProductImportApiResponseTypes = OwnerApiTypes.ApiResponseUnit;

const cancelProductImportResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
}) satisfies z.ZodType<CancelProductImportApiResponseTypes>;

export interface CancelProductImportParams {
  jobId: string;
  marketId: ApiPathParamTypes;
}

export const cancelProductImport = async ({ jobId, marketId }: CancelProductImportParams) => {
  const endpoint = API_ENDPOINTS.owner.products.importCancel(marketId, jobId);
  const response = await httpClient.post<unknown>(endpoint);

  validateApiResponse(cancelProductImportResponseSchema, response, {
    endpoint,
    schemaDescription: 'ApiResponseUnit',
  });
};
