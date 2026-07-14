import { describe, expect, it } from 'vitest';

import { API_ENDPOINTS, buildApiPath } from './api-endpoints';

describe('API_ENDPOINTS', () => {
  it('exposes owner auth and product import endpoints', () => {
    expect(API_ENDPOINTS.owner.auth.login).toBe('/v1/owners/auth/login');
    expect(API_ENDPOINTS.owner.products.import('market-1')).toBe(
      '/v1/owners/markets/market-1/products/import',
    );
    expect(API_ENDPOINTS.owner.products.importProgress('market-1', 'job-1')).toBe(
      '/v1/owners/markets/market-1/products/import/job-1/progress',
    );
  });

  it('encodes path parameters', () => {
    expect(API_ENDPOINTS.owner.products.detail('market/1', 'product 1')).toBe(
      '/v1/owners/markets/market%2F1/products/product%201',
    );
  });

  it('builds owner product query endpoints', () => {
    expect(
      API_ENDPOINTS.owner.products.collection('market-1', {
        type: 'PERIODIC',
        sort: 'VIEW_COUNT',
      }),
    ).toBe('/v1/owners/markets/market-1/products?type=PERIODIC&sort=VIEW_COUNT');

    expect(
      API_ENDPOINTS.owner.products.draft('market-1', {
        category: '과일',
        page: 1,
        search: '사과',
        size: 20,
      }),
    ).toBe(
      '/v1/owners/markets/market-1/products/draft?category=%EA%B3%BC%EC%9D%BC&page=1&search=%EC%82%AC%EA%B3%BC&size=20',
    );
  });

  it('exposes user and common endpoints', () => {
    expect(API_ENDPOINTS.user.auth.socialLogin('kakao')).toBe('/v1/users/login/oauth2/kakao');
    expect(API_ENDPOINTS.user.markets.location({ lat: 37.5, lng: 127.1 })).toBe(
      '/v1/users/markets/location?lat=37.5&lng=127.1',
    );
    expect(API_ENDPOINTS.common.auth.refresh).toBe('/v1/auth/token/refresh');
    expect(API_ENDPOINTS.common.uploads.presignedUrl).toBe('/v1/uploads/presigned-url');
  });
});

describe('buildApiPath', () => {
  it('omits nullish query params and repeats array values', () => {
    expect(
      buildApiPath('/v1/test', {
        empty: null,
        keyword: '상품',
        page: 0,
        tags: ['daily', undefined, 'periodic'],
      }),
    ).toBe('/v1/test?keyword=%EC%83%81%ED%92%88&page=0&tags=daily&tags=periodic');
  });
});
