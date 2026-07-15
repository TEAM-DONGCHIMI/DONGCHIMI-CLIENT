import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

import { periodicProductsParamsSchema } from '@/domains/market/model/periodic-products-schema';
import { createServerApi } from '@/shared/api/server-client';

export const runtime = 'nodejs';

const createErrorResponse = (status: number, code: string, message: string) => {
  return NextResponse.json(
    {
      code,
      message,
      success: false,
    },
    { status },
  );
};

const toOptionalNumber = (value: string | null) => {
  return value == null ? undefined : Number(value);
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const parsedParams = periodicProductsParamsSchema.safeParse({
    category: requestUrl.searchParams.get('category') ?? undefined,
    cursor: toOptionalNumber(requestUrl.searchParams.get('cursor')),
    marketId: toOptionalNumber(requestUrl.searchParams.get('marketId')),
    size: toOptionalNumber(requestUrl.searchParams.get('size')),
  });

  if (!parsedParams.success) {
    return createErrorResponse(400, 'INVALID_INPUT', '행사 상품 조회 조건이 올바르지 않습니다.');
  }

  const { category, cursor, marketId, size } = parsedParams.data;

  try {
    const serverApi = await createServerApi();
    const upstreamResponse = await serverApi.get(
      API_ENDPOINTS.user.products.periodic(marketId, { category, cursor, size }),
      {
        signal: request.signal,
        throwHttpErrors: false,
      },
    );
    const upstreamBody: unknown = await upstreamResponse.json();

    return NextResponse.json(upstreamBody, { status: upstreamResponse.status });
  } catch {
    return createErrorResponse(
      502,
      'PERIODIC_PRODUCTS_UPSTREAM_FAILED',
      '행사 할인 상품을 불러오지 못했습니다.',
    );
  }
}
