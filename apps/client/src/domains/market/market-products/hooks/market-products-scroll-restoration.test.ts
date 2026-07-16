import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearMarketProductsScrollRestoration,
  consumePendingMarketProductsScrollRestoration,
  getMarketProductAnchorId,
  isPrimaryProductLinkClick,
  MARKET_PRODUCTS_SCROLL_RESTORATION_TTL_MS,
  saveMarketProductsScrollRestoration,
} from './market-products-scroll-restoration';

const MARKET_SLUG = 'mangwon-fresh';
const MARKET_LIST_PATH = `/markets/${MARKET_SLUG}`;
const PRODUCT_DETAIL_PATH = `${MARKET_LIST_PATH}/products/201`;

const saveTodaySpecialState = () => {
  saveMarketProductsScrollRestoration({
    anchorId: getMarketProductAnchorId('today-special', 201),
    isExpanded: true,
    marketSlug: MARKET_SLUG,
    productId: '201',
    scrollY: 640,
    section: 'today-special',
    viewportTop: 120,
  });
};

describe('market products scroll restoration state', () => {
  beforeEach(() => {
    clearMarketProductsScrollRestoration(MARKET_SLUG);
    window.sessionStorage.clear();
    window.history.replaceState({}, '', MARKET_LIST_PATH);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('저장한 목록 history entry로 돌아왔을 때만 저장 상태를 반환한다', () => {
    saveTodaySpecialState();
    const marketListHistoryState = window.history.state;

    expect(consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toMatchObject({
      isExpanded: true,
      productId: '201',
      scrollY: 640,
      section: 'today-special',
      viewportTop: 120,
    });

    window.history.replaceState({}, '', PRODUCT_DETAIL_PATH);

    expect(consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toBeNull();

    window.history.replaceState(marketListHistoryState, '', MARKET_LIST_PATH);

    expect(consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toMatchObject({
      isExpanded: true,
      productId: '201',
      scrollY: 640,
      section: 'today-special',
      viewportTop: 120,
    });
  });

  it('TTL이 지난 저장 상태는 제거하고 복원하지 않는다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-16T09:00:00.000Z'));
    saveTodaySpecialState();
    vi.advanceTimersByTime(MARKET_PRODUCTS_SCROLL_RESTORATION_TTL_MS + 1);

    expect(consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toBeNull();
  });

  it('복원이 끝나면 저장 상태와 현재 history entry 표시를 함께 제거한다', () => {
    saveTodaySpecialState();

    clearMarketProductsScrollRestoration(MARKET_SLUG);

    expect(consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toBeNull();
    expect(window.sessionStorage).toHaveLength(0);
  });

  it('sessionStorage 쓰기가 실패해도 상품 이동 흐름에 오류를 던지지 않는다', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable');
    });

    expect(saveTodaySpecialState).not.toThrow();
  });

  it('수정 키 없는 primary link click만 현재 탭 이동으로 판단한다', () => {
    expect(
      isPrimaryProductLinkClick({
        altKey: false,
        button: 0,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
      }),
    ).toBe(true);
    expect(
      isPrimaryProductLinkClick({
        altKey: true,
        button: 0,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
      }),
    ).toBe(false);
  });
});
