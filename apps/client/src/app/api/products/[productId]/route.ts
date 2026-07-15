import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerApi } from '@/shared/api/server-client';

export const runtime = 'nodejs';

interface ProductDetailRouteContext {
  params: Promise<{ productId: string }>;
}

const productDetailRequestSchema = z.object({
  marketId: z.coerce.number().int().positive(),
  productId: z.coerce.number().int().positive(),
});

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

export async function GET(request: Request, { params }: ProductDetailRouteContext) {
  const { productId } = await params;
  const marketId = new URL(request.url).searchParams.get('marketId');
  const parsedParams = productDetailRequestSchema.safeParse({ marketId, productId });

  if (!parsedParams.success) {
    return createErrorResponse(400, 'INVALID_INPUT', '마트와 상품 식별자는 양의 정수여야 합니다.');
  }

  try {
    const serverApi = await createServerApi();
    const upstreamResponse = await serverApi.get(
      API_ENDPOINTS.user.products.detail(parsedParams.data.marketId, parsedParams.data.productId),
      { throwHttpErrors: false },
    );
    const upstreamBody: unknown = await upstreamResponse.json();

    return NextResponse.json(upstreamBody, { status: upstreamResponse.status });
  } catch {
    return createErrorResponse(
      502,
      'PRODUCT_DETAIL_UPSTREAM_FAILED',
      '상품 상세 정보를 불러오지 못했습니다.',
    );
  }
}
