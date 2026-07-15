import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';
import { ApiResponseValidationError } from '@dongchimi/shared/api';

import { getMarketDetail } from './market-detail-api';
import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from './market-detail-api.mock';
import { resolveMarketDetailResponse } from '../model/market-detail-schema';

const MARKET_DETAIL_ENDPOINT = `${window.location.origin}/api/markets/mangwon-fresh`;

describe('getMarketDetail', () => {
  it('slug path parameter로 마트 상세 정보를 조회한다', async () => {
    server.use(
      http.get(MARKET_DETAIL_ENDPOINT, () => {
        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    await expect(getMarketDetail({ slug: 'mangwon-fresh' })).resolves.toEqual(
      MARKET_DETAIL_API_RESPONSE_FIXTURE.data,
    );
  });

  it('계약과 다른 응답은 validation error로 노출한다', async () => {
    server.use(
      http.get(MARKET_DETAIL_ENDPOINT, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: {},
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    await expect(getMarketDetail({ slug: 'mangwon-fresh' })).rejects.toMatchObject({
      name: 'ApiResponseValidationError',
      type: 'validation',
    });
  });

  it('빈 slug path parameter는 요청 전에 validation error로 노출한다', async () => {
    await expect(getMarketDetail({ slug: '' })).rejects.toMatchObject({
      name: 'ZodError',
    });
  });

  it('marketId는 양의 정수만 허용한다', () => {
    const response = {
      ...MARKET_DETAIL_API_RESPONSE_FIXTURE,
      data: {
        ...MARKET_DETAIL_API_RESPONSE_FIXTURE.data,
        marketId: 0,
      },
    };

    expect(() => resolveMarketDetailResponse(response)).toThrow(ApiResponseValidationError);
  });

  it('MONDAY부터 SUNDAY까지의 요일 값만 허용한다', () => {
    const response = {
      ...MARKET_DETAIL_API_RESPONSE_FIXTURE,
      data: {
        ...MARKET_DETAIL_API_RESPONSE_FIXTURE.data,
        businessHours: [
          {
            close: '18:00',
            days: ['HOLIDAY'],
            isOpen: true,
            open: '13:00',
          },
        ],
      },
    };

    expect(() => resolveMarketDetailResponse(response)).toThrow(ApiResponseValidationError);
  });

  it('영업일의 open과 close는 HH:mm 형식만 허용한다', () => {
    const response = {
      ...MARKET_DETAIL_API_RESPONSE_FIXTURE,
      data: {
        ...MARKET_DETAIL_API_RESPONSE_FIXTURE.data,
        businessHours: [
          {
            close: '24:00',
            days: ['MONDAY'],
            isOpen: true,
            open: '오전 10시',
          },
        ],
      },
    };

    expect(() => resolveMarketDetailResponse(response)).toThrow(ApiResponseValidationError);
  });

  it('휴무일에는 open과 close를 허용하지 않는다', () => {
    const response = {
      ...MARKET_DETAIL_API_RESPONSE_FIXTURE,
      data: {
        ...MARKET_DETAIL_API_RESPONSE_FIXTURE.data,
        businessHours: [
          {
            close: '20:00',
            days: ['SUNDAY'],
            isOpen: false,
            open: '10:00',
          },
        ],
      },
    };

    expect(() => resolveMarketDetailResponse(response)).toThrow(ApiResponseValidationError);
  });
});
