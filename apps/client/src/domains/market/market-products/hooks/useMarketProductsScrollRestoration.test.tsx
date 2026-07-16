import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearMarketProductsScrollRestoration,
  getMarketProductAnchorId,
  saveMarketProductsScrollRestoration,
} from './market-products-scroll-restoration';
import { useMarketProductsScrollRestoration } from './useMarketProductsScrollRestoration';

const MARKET_SLUG = 'mangwon-fresh';
const MARKET_LIST_PATH = `/markets/${MARKET_SLUG}`;
const PRODUCT_DETAIL_PATH = `${MARKET_LIST_PATH}/products/303`;

const useTimerAnimationFrame = () => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    return window.setTimeout(() => callback(Date.now()), 16);
  });
  vi.stubGlobal('cancelAnimationFrame', (animationFrameId: number) => {
    window.clearTimeout(animationFrameId);
  });
};

describe('useMarketProductsScrollRestoration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useTimerAnimationFrame();
    clearMarketProductsScrollRestoration(MARKET_SLUG);
    window.sessionStorage.clear();
    window.history.replaceState({}, '', MARKET_LIST_PATH);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('상품 anchor를 보정한 뒤 두 frame 동안 위치가 안정되면 완료한다', () => {
    const anchorId = getMarketProductAnchorId('event-discount', 303);
    const anchor = document.createElement('a');
    let anchorTop = 240;
    const scrollBy = vi.fn(({ top }: ScrollToOptions) => {
      anchorTop -= top ?? 0;
    });

    anchor.id = anchorId;
    vi.spyOn(anchor, 'getBoundingClientRect').mockImplementation(() => ({
      bottom: anchorTop + 100,
      height: 100,
      left: 0,
      right: 100,
      toJSON: () => ({}),
      top: anchorTop,
      width: 100,
      x: 0,
      y: anchorTop,
    }));
    document.body.append(anchor);
    vi.stubGlobal('scrollBy', scrollBy);
    saveMarketProductsScrollRestoration({
      anchorId,
      isCategoryExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: '303',
      scrollY: 1_400,
      section: 'event-discount',
      selectedCategoryId: 'meat-egg',
      viewportTop: 80,
    });
    const { result } = renderHook(() => useMarketProductsScrollRestoration(MARKET_SLUG));

    expect(result.current).toMatchObject({
      section: 'event-discount',
      selectedCategoryId: 'meat-egg',
    });

    act(() => {
      vi.advanceTimersByTime(48);
    });

    expect(result.current).toBeNull();
    expect(scrollBy).toHaveBeenCalledTimes(1);
    expect(scrollBy).toHaveBeenLastCalledWith({ behavior: 'auto', left: 0, top: 160 });
  });

  it('anchor 차이가 남아 있으면 성공 처리하지 않고 timeout에서 scrollY를 사용한다', () => {
    const anchorId = getMarketProductAnchorId('event-discount', 303);
    const anchor = document.createElement('a');
    const scrollBy = vi.fn();
    const scrollTo = vi.fn();

    anchor.id = anchorId;
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
      bottom: 340,
      height: 100,
      left: 0,
      right: 100,
      toJSON: () => ({}),
      top: 240,
      width: 100,
      x: 0,
      y: 240,
    });
    document.body.append(anchor);
    vi.stubGlobal('scrollBy', scrollBy);
    vi.stubGlobal('scrollTo', scrollTo);
    saveMarketProductsScrollRestoration({
      anchorId,
      isCategoryExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: '303',
      scrollY: 1_400,
      section: 'event-discount',
      selectedCategoryId: 'meat-egg',
      viewportTop: 80,
    });

    const { result } = renderHook(() => useMarketProductsScrollRestoration(MARKET_SLUG));

    act(() => {
      vi.advanceTimersByTime(32);
    });

    expect(result.current).not.toBeNull();
    expect(scrollBy).toHaveBeenCalledTimes(2);

    act(() => {
      vi.advanceTimersByTime(3_100);
    });

    expect(result.current).toBeNull();
    expect(scrollTo).toHaveBeenCalledWith({ behavior: 'auto', left: 0, top: 1_400 });
  });

  it('제한 시간 동안 anchor를 찾지 못하면 저장한 scrollY를 사용한다', () => {
    const scrollTo = vi.fn();

    vi.stubGlobal('scrollTo', scrollTo);
    saveMarketProductsScrollRestoration({
      anchorId: getMarketProductAnchorId('today-special', 299),
      isExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: '299',
      scrollY: 980,
      section: 'today-special',
      viewportTop: 120,
    });
    renderHook(() => useMarketProductsScrollRestoration(MARKET_SLUG));

    act(() => {
      vi.advanceTimersByTime(3_100);
    });

    expect(scrollTo).toHaveBeenCalledWith({ behavior: 'auto', left: 0, top: 980 });
  });

  it('마운트된 목록이 재사용돼도 popstate에서 저장 상태를 다시 읽는다', () => {
    const anchorId = getMarketProductAnchorId('event-discount', 303);
    const anchor = document.createElement('a');
    let anchorTop = 240;
    const scrollBy = vi.fn(({ top }: ScrollToOptions) => {
      anchorTop -= top ?? 0;
    });

    anchor.id = anchorId;
    vi.spyOn(anchor, 'getBoundingClientRect').mockImplementation(() => ({
      bottom: anchorTop + 100,
      height: 100,
      left: 0,
      right: 100,
      toJSON: () => ({}),
      top: anchorTop,
      width: 100,
      x: 0,
      y: anchorTop,
    }));
    document.body.append(anchor);
    vi.stubGlobal('scrollBy', scrollBy);

    const { result } = renderHook(() => useMarketProductsScrollRestoration(MARKET_SLUG));

    expect(result.current).toBeNull();

    saveMarketProductsScrollRestoration({
      anchorId,
      isCategoryExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: '303',
      scrollY: 1_400,
      section: 'event-discount',
      selectedCategoryId: 'meat-egg',
      viewportTop: 80,
    });

    const marketListHistoryState = window.history.state;

    window.history.replaceState({}, '', PRODUCT_DETAIL_PATH);

    act(() => {
      window.history.replaceState(marketListHistoryState, '', MARKET_LIST_PATH);
      window.dispatchEvent(
        new PopStateEvent('popstate', {
          state: marketListHistoryState,
        }),
      );
    });

    expect(result.current).toMatchObject({
      section: 'event-discount',
      selectedCategoryId: 'meat-egg',
    });

    act(() => {
      vi.advanceTimersByTime(48);
    });

    expect(result.current).toBeNull();
    expect(scrollBy).toHaveBeenCalledTimes(1);
  });
});
