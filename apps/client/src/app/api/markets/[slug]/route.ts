import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

import { getServerApiEnv } from '@/shared/config';

const API_CONFIGURATION_ERROR_MESSAGE = 'API 서버 설정을 확인해주세요.';
const UPSTREAM_REQUEST_ERROR_MESSAGE = '마트 정보를 불러오지 못했어요.';
const UPSTREAM_RESPONSE_ERROR_MESSAGE = 'API 서버에서 올바른 응답을 받지 못했어요.';

const isJsonContentType = (contentType: string | null): contentType is string => {
  return contentType?.includes('application/json') ?? false;
};

const createProxyErrorResponse = (message: string, status: number) => {
  return NextResponse.json(
    {
      code: 'API_PROXY_ERROR',
      message,
      success: false,
    },
    { status },
  );
};

type RouteContextTypes = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export const GET = async (_request: Request, { params }: RouteContextTypes) => {
  const { apiBaseUrl, developmentAccessToken } = getServerApiEnv();

  if (!apiBaseUrl) {
    return createProxyErrorResponse(API_CONFIGURATION_ERROR_MESSAGE, 500);
  }

  const { slug } = await params;
  const headers = new Headers({ Accept: 'application/json' });

  if (developmentAccessToken) {
    headers.set('Authorization', `Bearer ${developmentAccessToken}`);
  }

  try {
    const upstreamResponse = await fetch(
      new URL(API_ENDPOINTS.user.markets.detail(slug), apiBaseUrl),
      {
        cache: 'no-store',
        headers,
      },
    );
    const contentType = upstreamResponse.headers.get('content-type');

    if (!isJsonContentType(contentType)) {
      return createProxyErrorResponse(UPSTREAM_RESPONSE_ERROR_MESSAGE, 502);
    }

    const responseBody = await upstreamResponse.text();

    return new NextResponse(responseBody, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': contentType,
      },
      status: upstreamResponse.status,
    });
  } catch {
    return createProxyErrorResponse(UPSTREAM_REQUEST_ERROR_MESSAGE, 502);
  }
};
