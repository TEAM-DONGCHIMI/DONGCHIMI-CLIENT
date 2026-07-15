import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

import { createServerApi } from '@/shared/api/server-client';

export const runtime = 'nodejs';

interface DailyProductsRouteContext {
  params: Promise<{ marketId: string }>;
}

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

export async function GET(_request: Request, { params }: DailyProductsRouteContext) {
  const { marketId } = await params;
  const numericMarketId = Number(marketId);

  if (!Number.isInteger(numericMarketId) || numericMarketId <= 0) {
    return createErrorResponse(400, 'INVALID_INPUT', '마트 식별자는 양의 정수여야 합니다.');
  }

  try {
    const serverApi = await createServerApi();
    const upstreamResponse = await serverApi.get(
      API_ENDPOINTS.user.products.daily(numericMarketId),
      {
        throwHttpErrors: false,
      },
    );
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
