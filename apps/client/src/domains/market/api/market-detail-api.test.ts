import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';

import { getMarketDetail } from './market-detail-api';
import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from './market-detail-api.mock';
import { resolveMarketDetailResponse } from '../model/market-detail-schema';

describe('getMarketDetail', () => {
  it('slug path parameter로 마트 상세 정보를 조회한다', async () => {
    server.use(
      http.get('*/api/markets/:slug', ({ params }) => {
        expect(params.slug).toBe('mangwon-fresh');

        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    await expect(getMarketDetail({ slug: 'mangwon-fresh' })).resolves.toEqual(
      MARKET_DETAIL_API_RESPONSE_FIXTURE.data,
    );
  });

  it('계약과 다른 응답은 validation error로 노출한다', async () => {
    server.use(
      http.get('*/api/markets/:slug', () => {
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

  it('요일 값은 Swagger의 string[] 계약을 그대로 보존한다', () => {
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

    expect(resolveMarketDetailResponse(response).businessHours[0]?.days).toEqual(['HOLIDAY']);
  });
});
