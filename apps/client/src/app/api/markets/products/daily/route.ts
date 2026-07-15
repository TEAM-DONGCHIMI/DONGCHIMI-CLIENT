import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

import { dailyProductsParamsSchema } from '@/domains/market/model/daily-products-schema';
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
  const parsedParams = dailyProductsParamsSchema.safeParse({
    marketId: toOptionalNumber(requestUrl.searchParams.get('marketId')),
  });

  if (!parsedParams.success) {
    return createErrorResponse(400, 'INVALID_INPUT', '마트 식별자는 양의 정수여야 합니다.');
  }

  const { marketId } = parsedParams.data;

  try {
    const serverApi = await createServerApi();
    const upstreamResponse = await serverApi.get(API_ENDPOINTS.user.products.daily(marketId), {
      signal: request.signal,
      throwHttpErrors: false,
    });
    const upstreamBody: unknown = await upstreamResponse.json();

    return NextResponse.json(upstreamBody, { status: upstreamResponse.status });
  } catch {
    return createErrorResponse(
      502,
      'DAILY_PRODUCTS_UPSTREAM_FAILED',
      '오늘의 특가 상품을 불러오지 못했습니다.',
    );
  }
}
