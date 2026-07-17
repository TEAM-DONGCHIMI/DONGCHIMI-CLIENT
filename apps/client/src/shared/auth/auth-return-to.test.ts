import { describe, expect, it } from 'vitest';

import {
  buildAuthRequiredLoginHref,
  buildKakaoAuthorizeHref,
  normalizeAuthReturnTo,
} from './auth-return-to';

describe('normalizeAuthReturnTo', () => {
  it.each([
    ['/markets', '/markets'],
    ['/markets/mangwon-fresh', '/markets/mangwon-fresh'],
    [
      '/markets/mangwon-fresh/products/402?tab=detail&page=2',
      '/markets/mangwon-fresh/products/402?tab=detail&page=2',
    ],
    ['/markets/mangwon-fresh?tab=top#price', '/markets/mangwon-fresh?tab=top'],
    ['/markets/first/../second', '/markets/second'],
  ])('허용된 마트 내부 경로 %s를 정규화한다', (value, expected) => {
    expect(normalizeAuthReturnTo(value)).toBe(expected);
  });

  it.each([
    undefined,
    null,
    '',
    'markets',
    'https://evil.example/markets',
    '//evil.example/markets',
    '/\\evil.example/markets',
    'javascript:alert(1)',
    '/login',
    '/oauth/callback',
    '/api/auth/kakao/login',
    '/markets-evil',
    '/markets/../login',
    '/markets\u0000/unsafe',
    `/markets/${'a'.repeat(2_048)}`,
    { pathname: '/markets' },
  ])('안전하지 않은 returnTo %j는 /markets로 대체한다', (value) => {
    expect(normalizeAuthReturnTo(value)).toBe('/markets');
  });
});

describe('auth return path builders', () => {
  it('현재 마트 pathname과 search를 로그인 returnTo로 한 번 인코딩한다', () => {
    expect(
      buildAuthRequiredLoginHref({
        pathname: '/markets/mangwon-fresh/products/402',
        search: '?tab=detail&page=2',
      }),
    ).toBe(
      '/login?reason=auth-required&returnTo=%2Fmarkets%2Fmangwon-fresh%2Fproducts%2F402%3Ftab%3Ddetail%26page%3D2',
    );
  });

  it('현재 경로가 허용 범위 밖이면 /markets를 로그인 returnTo로 사용한다', () => {
    expect(buildAuthRequiredLoginHref({ pathname: '/login', search: '' })).toBe(
      '/login?reason=auth-required&returnTo=%2Fmarkets',
    );
  });

  it('카카오 authorize href에도 검증된 returnTo만 포함한다', () => {
    expect(buildKakaoAuthorizeHref('/markets/mangwon-fresh?tab=top')).toBe(
      '/api/auth/kakao/authorize?returnTo=%2Fmarkets%2Fmangwon-fresh%3Ftab%3Dtop',
    );
    expect(buildKakaoAuthorizeHref('https://evil.example')).toBe(
      '/api/auth/kakao/authorize?returnTo=%2Fmarkets',
    );
  });
});
