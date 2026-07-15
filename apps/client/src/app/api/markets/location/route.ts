import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

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

const parseNumberSearchParam = (searchParams: URLSearchParams, key: string) => {
  const value = searchParams.get(key);

  if (value === null) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : Number.NaN;
};

const resolveLocationSearchParams = (request: Request) => {
  const searchParams = new URL(request.url).searchParams;

  return {
    cursor: parseNumberSearchParam(searchParams, 'cursor'),
    lat: parseNumberSearchParam(searchParams, 'lat'),
    lng: parseNumberSearchParam(searchParams, 'lng'),
    radius: parseNumberSearchParam(searchParams, 'radius'),
    size: parseNumberSearchParam(searchParams, 'size'),
  };
};

export async function GET(request: Request) {
  const searchParams = resolveLocationSearchParams(request);
  const { lat, lng } = searchParams;
  const hasInvalidNumberParam = Object.values(searchParams).some(
    (value) => typeof value === 'number' && Number.isNaN(value),
  );

  if (
    hasInvalidNumberParam ||
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return createErrorResponse(400, 'INVALID_INPUT', '위치 좌표는 필수입니다.');
  }

  try {
    const serverApi = await createServerApi();
    const upstreamResponse = await serverApi.get(
      API_ENDPOINTS.user.markets.location({
        cursor: searchParams.cursor,
        lat,
        lng,
        radius: searchParams.radius,
        size: searchParams.size,
      }),
      {
        throwHttpErrors: false,
      },
    );
    const upstreamBody: unknown = await upstreamResponse.json();

    return NextResponse.json(upstreamBody, { status: upstreamResponse.status });
  } catch {
    return createErrorResponse(
      502,
      'NEARBY_MARKETS_UPSTREAM_FAILED',
      '주변 마트 정보를 불러오지 못했습니다.',
    );
  }
}
