import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

import { createServerApi } from '@/shared/api/server-client';

export const runtime = 'nodejs';

interface MarketDetailRouteContext {
  params: Promise<{ slug: string }>;
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

export async function GET(_request: Request, { params }: MarketDetailRouteContext) {
  const { slug } = await params;

  if (!slug.trim()) {
    return createErrorResponse(400, 'INVALID_INPUT', '마트 식별자는 필수입니다.');
  }

  try {
    const serverApi = await createServerApi();
    const upstreamResponse = await serverApi.get(API_ENDPOINTS.user.markets.detail(slug), {
      throwHttpErrors: false,
    });
    const upstreamBody: unknown = await upstreamResponse.json();

    return NextResponse.json(upstreamBody, { status: upstreamResponse.status });
  } catch {
    return createErrorResponse(
      502,
      'MARKET_DETAIL_UPSTREAM_FAILED',
      '마트 상세 정보를 불러오지 못했습니다.',
    );
  }
}
