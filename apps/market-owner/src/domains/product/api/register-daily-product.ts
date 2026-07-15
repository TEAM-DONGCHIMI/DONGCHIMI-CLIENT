import { API_ENDPOINTS, validateApiResponse, z } from '@dongchimi/shared/api';

import { httpClient, type OwnerApiTypes } from '@/shared/api';

export type RegisterDailyProductRequestTypes = OwnerApiTypes.DailyProductRegisterRequest;
export type RegisterDailyProductResponseTypes = OwnerApiTypes.RegisterDailyProductData & {
  data: OwnerApiTypes.DailyProductRegisterResponse;
};

export interface RegisterDailyProductParams {
  marketId: number | string;
  request: RegisterDailyProductRequestTypes;
}

const registerDailyProductResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    productId: z.number().int().positive(),
  }),
}) satisfies z.ZodType<RegisterDailyProductResponseTypes>;

export const registerDailyProduct = async ({
  marketId,
  request,
}: RegisterDailyProductParams): Promise<RegisterDailyProductResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.daily(marketId);
  const response = await httpClient.post<unknown>(endpoint, {
    json: request,
  });

  return validateApiResponse(registerDailyProductResponseSchema, response, {
    endpoint,
    schemaDescription: 'Daily product registration response',
  });
};
