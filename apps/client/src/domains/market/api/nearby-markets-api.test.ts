import { API_ENDPOINTS, ApiResponseValidationError } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';
import { getNearbyMarketMarkers, getNearbyMarkets } from './nearby-markets-api';

const NEARBY_MARKETS_ENDPOINT = API_ENDPOINTS.user.markets
  .location({
    lat: 37.5651,
    lng: 126.9895,
    radius: 1000,
    size: 5,
  })
  .replace('/v1/users', '/api');
const NEARBY_MARKET_MARKERS_ENDPOINT = API_ENDPOINTS.user.markets
  .location({
    lat: 37.5651,
    lng: 126.9895,
    radius: 1000,
    size: 50,
  })
  .replace('/v1/users', '/api');

const nearbyMarket = {
  marketId: 1,
  name: '신선마트',
  slug: 'abcd1234',
  thumbnailUrl: 'https://cdn.example.com/contents/1.png',
  address: '서울특별시 강남구 테헤란로 123',
  latitude: 37.5651,
  longitude: 126.9895,
  distance: '512m',
  isOpen: true,
  productCount: 6,
  previewProducts: [
    {
      productId: 101,
      name: '삼겹살 500g',
      thumbnailUrl: 'https://cdn.example.com/products/101.png',
      originalPrice: 7700,
      discountedPrice: 6900,
      discountRate: 10,
    },
  ],
};

describe('getNearbyMarkets', () => {
  it('주변 마트 API 응답을 화면 목록 데이터로 반환한다', async () => {
    server.use(
      http.get(`${window.location.origin}${NEARBY_MARKETS_ENDPOINT}`, () => {
        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          data: {
            hasNext: true,
            nextCursor: 123,
            contents: [nearbyMarket],
          },
        });
      }),
    );

    const result = await getNearbyMarkets({ lat: 37.5651, lng: 126.9895 });

    expect(result).toEqual({
      hasNext: true,
      nextCursor: 123,
      contents: [nearbyMarket],
    });
  });

  it('Swagger generated contract의 content 필드도 contents로 정규화한다', async () => {
    server.use(
      http.get(`${window.location.origin}${NEARBY_MARKETS_ENDPOINT}`, () => {
        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          data: {
            hasNext: false,
            nextCursor: null,
            content: [nearbyMarket],
          },
        });
      }),
    );

    const result = await getNearbyMarkets({ lat: 37.5651, lng: 126.9895 });

    expect(result.contents).toEqual([nearbyMarket]);
    expect(result.hasNext).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('응답 계약이 다르면 validation error를 던진다', async () => {
    server.use(
      http.get(`${window.location.origin}${NEARBY_MARKETS_ENDPOINT}`, () => {
        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          data: {
            hasNext: false,
            nextCursor: null,
            contents: [{ marketId: '1' }],
          },
        });
      }),
    );

    await expect(getNearbyMarkets({ lat: 37.5651, lng: 126.9895 })).rejects.toThrow(
      ApiResponseValidationError,
    );
  });

  it('requests marker list with default size 50', async () => {
    server.use(
      http.get(`${window.location.origin}${NEARBY_MARKET_MARKERS_ENDPOINT}`, () => {
        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          data: {
            hasNext: false,
            nextCursor: null,
            contents: [],
          },
        });
      }),
    );

    const result = await getNearbyMarketMarkers({ lat: 37.5651, lng: 126.9895 });

    expect(result.contents).toEqual([]);
  });
});
