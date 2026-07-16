import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const MARKET_SLUG = 'mangwon-fresh';
const MARKET_LIST_PATH = `/markets/${MARKET_SLUG}`;
const MARKET_PRODUCTS_HISTORY_ENTRY_KEY = '__dongchimiMarketProductsScrollRestoration';

describe('market products scroll restoration reload', () => {
  beforeEach(() => {
    vi.resetModules();
    window.sessionStorage.clear();
    window.history.replaceState({}, '', MARKET_LIST_PATH);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('새 앱 실행에서는 새로고침 전에 저장한 복원 token을 무효화한다', async () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.3);
    const initialRuntime = await import('./market-products-scroll-restoration');

    initialRuntime.saveMarketProductsScrollRestoration({
      anchorId: initialRuntime.getMarketProductAnchorId('today-special', 201),
      isExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: '201',
      scrollY: 640,
      section: 'today-special',
      viewportTop: 120,
    });

    const storageKey = window.sessionStorage.key(0);
    const serializedState = storageKey == null ? null : window.sessionStorage.getItem(storageKey);
    const storedState = JSON.parse(serializedState ?? '{}') as Record<string, unknown>;
    const historyEntry = window.history.state[MARKET_PRODUCTS_HISTORY_ENTRY_KEY] as Record<
      string,
      unknown
    >;

    expect(
      initialRuntime.consumePendingMarketProductsScrollRestoration(MARKET_SLUG),
    ).not.toBeNull();
    expect(storedState.executionEpoch).toBeTypeOf('string');
    expect(historyEntry.executionEpoch).toBe(storedState.executionEpoch);

    vi.resetModules();
    const reloadedRuntime = await import('./market-products-scroll-restoration');

    expect(reloadedRuntime.peekPendingMarketProductsScrollRestoration(MARKET_SLUG)).toBeNull();
    expect(window.sessionStorage).toHaveLength(1);
    expect(reloadedRuntime.consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toBeNull();
    expect(window.sessionStorage).toHaveLength(0);
  });

  it('history entry의 실행 epoch가 다르면 같은 실행의 snapshot도 복원하지 않는다', async () => {
    const runtime = await import('./market-products-scroll-restoration');

    runtime.saveMarketProductsScrollRestoration({
      anchorId: runtime.getMarketProductAnchorId('today-special', 201),
      isExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: '201',
      scrollY: 640,
      section: 'today-special',
      viewportTop: 120,
    });

    const historyEntry = window.history.state[MARKET_PRODUCTS_HISTORY_ENTRY_KEY] as Record<
      string,
      unknown
    >;

    window.history.replaceState(
      {
        ...window.history.state,
        [MARKET_PRODUCTS_HISTORY_ENTRY_KEY]: {
          ...historyEntry,
          executionEpoch: 'another-execution',
        },
      },
      '',
    );

    expect(runtime.consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toBeNull();
    expect(window.sessionStorage).toHaveLength(1);
  });
});
