import {
  API_ENDPOINTS,
  type ApiPathParamTypes,
  validateApiResponse,
  z,
} from '@dongchimi/shared/api';

import { httpClient } from '@/shared/api';

import {
  ownerPreparedProductDraftResponseSchema,
  type GetPreparedProductDraftsResponseTypes,
  type PreparedProductDraftSearchParamsTypes,
} from './prepared-product-draft.schema';

export interface GetPreparedProductDraftsParams extends PreparedProductDraftSearchParamsTypes {
  marketId: ApiPathParamTypes;
}

export const MAX_PREPARED_PRODUCT_DRAFT_QUERY_SIZE = 100;

const getPreparedProductDraftsResponseSchema = z.object({
  success: z.literal(true),
  code: z.literal('SUCCESS'),
  message: z.string(),
  data: z.object({
    totalCount: z.number(),
    successCount: z.number(),
    failCount: z.number(),
    preparedProducts: z.array(ownerPreparedProductDraftResponseSchema),
  }),
}) satisfies z.ZodType<GetPreparedProductDraftsResponseTypes>;

export const getPreparedProductDrafts = async ({
  categories,
  marketId,
  page = 0,
  search,
  size = 10,
}: GetPreparedProductDraftsParams): Promise<GetPreparedProductDraftsResponseTypes> => {
  const endpoint = API_ENDPOINTS.owner.products.draft(marketId, {
    categories,
    page,
    search,
    size,
  });
  const response = await httpClient.get<unknown>(endpoint);

  return validateApiResponse(getPreparedProductDraftsResponseSchema, response, {
    endpoint,
    schemaDescription: 'Owner prepared product draft list response',
  });
};

export const getAllPreparedProductDrafts = async ({
  categories,
  marketId,
  search,
  size = MAX_PREPARED_PRODUCT_DRAFT_QUERY_SIZE,
}: GetPreparedProductDraftsParams): Promise<GetPreparedProductDraftsResponseTypes> => {
  const requestSize = Math.max(1, Math.min(size, MAX_PREPARED_PRODUCT_DRAFT_QUERY_SIZE));
  const firstPageResponse = await getPreparedProductDrafts({
    categories,
    marketId,
    page: 0,
    search,
    size: requestSize,
  });
  const totalCount = firstPageResponse.data.totalCount;
  const pageCount = Math.ceil(totalCount / requestSize);

  if (pageCount <= 1) {
    return firstPageResponse;
  }

  const remainingPageResponses = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      getPreparedProductDrafts({
        categories,
        marketId,
        page: index + 1,
        search,
        size: requestSize,
      }),
    ),
  );

  return {
    ...firstPageResponse,
    data: {
      ...firstPageResponse.data,
      preparedProducts: [
        ...firstPageResponse.data.preparedProducts,
        ...remainingPageResponses.flatMap((response) => response.data.preparedProducts),
      ],
    },
  };
};
