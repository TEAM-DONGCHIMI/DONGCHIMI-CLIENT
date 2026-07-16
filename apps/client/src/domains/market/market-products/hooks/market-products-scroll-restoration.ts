export const MARKET_PRODUCTS_SCROLL_RESTORATION_TTL_MS = 30 * 60 * 1000;

const MARKET_PRODUCTS_SCROLL_RESTORATION_VERSION = 1;
const MARKET_PRODUCTS_SCROLL_RESTORATION_KEY_PREFIX = 'market-products-scroll-restoration';
const MARKET_PRODUCTS_HISTORY_ENTRY_KEY = '__dongchimiMarketProductsScrollRestoration';

export type MarketProductSectionTypes = 'event-discount' | 'popular' | 'today-special';

interface MarketProductsScrollRestorationBaseTypes {
  anchorId: string;
  marketSlug: string;
  productId: string;
  restorationId: string;
  savedAt: number;
  scrollY: number;
  version: typeof MARKET_PRODUCTS_SCROLL_RESTORATION_VERSION;
  viewportTop: number;
}

export interface TodaySpecialScrollRestorationTypes extends MarketProductsScrollRestorationBaseTypes {
  isExpanded: boolean;
  section: 'today-special';
}

export interface EventDiscountScrollRestorationTypes extends MarketProductsScrollRestorationBaseTypes {
  isCategoryExpanded: boolean;
  section: 'event-discount';
  selectedCategoryId: string;
}

export interface PopularScrollRestorationTypes extends MarketProductsScrollRestorationBaseTypes {
  section: 'popular';
}

export type MarketProductsScrollRestorationTypes =
  | EventDiscountScrollRestorationTypes
  | PopularScrollRestorationTypes
  | TodaySpecialScrollRestorationTypes;

export type SaveMarketProductsScrollRestorationTypes =
  | Omit<EventDiscountScrollRestorationTypes, 'restorationId' | 'savedAt' | 'version'>
  | Omit<PopularScrollRestorationTypes, 'restorationId' | 'savedAt' | 'version'>
  | Omit<TodaySpecialScrollRestorationTypes, 'restorationId' | 'savedAt' | 'version'>;

interface ProductLinkClickTypes {
  altKey: boolean;
  button: number;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

interface MarketProductsHistoryEntryTypes {
  marketSlug: string;
  restorationId: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value != null;
};

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

const hasValidBaseState = (value: Record<string, unknown>) => {
  return (
    value.version === MARKET_PRODUCTS_SCROLL_RESTORATION_VERSION &&
    typeof value.anchorId === 'string' &&
    value.anchorId.length > 0 &&
    typeof value.marketSlug === 'string' &&
    value.marketSlug.length > 0 &&
    typeof value.productId === 'string' &&
    value.productId.length > 0 &&
    typeof value.restorationId === 'string' &&
    value.restorationId.length > 0 &&
    isFiniteNumber(value.savedAt) &&
    isFiniteNumber(value.scrollY) &&
    isFiniteNumber(value.viewportTop)
  );
};

const isMarketProductsScrollRestorationState = (
  value: unknown,
): value is MarketProductsScrollRestorationTypes => {
  if (!isRecord(value) || !hasValidBaseState(value)) {
    return false;
  }

  if (value.section === 'today-special') {
    return typeof value.isExpanded === 'boolean';
  }

  if (value.section === 'event-discount') {
    return (
      typeof value.isCategoryExpanded === 'boolean' &&
      typeof value.selectedCategoryId === 'string' &&
      value.selectedCategoryId.length > 0
    );
  }

  if (value.section === 'popular') {
    return true;
  }

  return false;
};

const getStorageKey = (marketSlug: string) => {
  return `${MARKET_PRODUCTS_SCROLL_RESTORATION_KEY_PREFIX}:${encodeURIComponent(marketSlug)}`;
};

const removeStoredState = (marketSlug: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.removeItem(getStorageKey(marketSlug));
  } catch {
    return;
  }
};

const readStoredState = (marketSlug: string): MarketProductsScrollRestorationTypes | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const serializedState = window.sessionStorage.getItem(getStorageKey(marketSlug));

    if (serializedState == null) {
      return null;
    }

    const state: unknown = JSON.parse(serializedState);

    if (
      !isMarketProductsScrollRestorationState(state) ||
      state.marketSlug !== marketSlug ||
      Date.now() - state.savedAt > MARKET_PRODUCTS_SCROLL_RESTORATION_TTL_MS
    ) {
      removeStoredState(marketSlug);
      return null;
    }

    return state;
  } catch {
    removeStoredState(marketSlug);
    return null;
  }
};

const isMarketProductsHistoryEntry = (value: unknown): value is MarketProductsHistoryEntryTypes => {
  return (
    isRecord(value) &&
    typeof value.marketSlug === 'string' &&
    value.marketSlug.length > 0 &&
    typeof value.restorationId === 'string' &&
    value.restorationId.length > 0
  );
};

const readCurrentHistoryEntry = (): MarketProductsHistoryEntryTypes | null => {
  if (typeof window === 'undefined' || !isRecord(window.history.state)) {
    return null;
  }

  const historyEntry = window.history.state[MARKET_PRODUCTS_HISTORY_ENTRY_KEY];

  return isMarketProductsHistoryEntry(historyEntry) ? historyEntry : null;
};

const markCurrentHistoryEntry = (marketSlug: string, restorationId: string) => {
  const currentHistoryState = isRecord(window.history.state) ? window.history.state : {};

  window.history.replaceState(
    {
      ...currentHistoryState,
      [MARKET_PRODUCTS_HISTORY_ENTRY_KEY]: { marketSlug, restorationId },
    },
    '',
  );
};

const removeCurrentHistoryEntry = (marketSlug: string) => {
  try {
    const historyEntry = readCurrentHistoryEntry();

    if (historyEntry?.marketSlug !== marketSlug || !isRecord(window.history.state)) {
      return;
    }

    const nextHistoryState = { ...window.history.state };

    delete nextHistoryState[MARKET_PRODUCTS_HISTORY_ENTRY_KEY];
    window.history.replaceState(nextHistoryState, '');
  } catch {
    return;
  }
};

const createRestorationId = () => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

export const getMarketProductAnchorId = (
  section: MarketProductSectionTypes,
  productId: number | string,
) => {
  return `market-${section}-product-${productId}`;
};

export const isPrimaryProductLinkClick = ({
  altKey,
  button,
  ctrlKey,
  metaKey,
  shiftKey,
}: ProductLinkClickTypes) => {
  return button === 0 && !altKey && !ctrlKey && !metaKey && !shiftKey;
};

export const saveMarketProductsScrollRestoration = (
  state: SaveMarketProductsScrollRestorationTypes,
) => {
  if (typeof window === 'undefined') {
    return;
  }

  const restorationId = createRestorationId();
  const nextState = {
    ...state,
    restorationId,
    savedAt: Date.now(),
    version: MARKET_PRODUCTS_SCROLL_RESTORATION_VERSION,
  } satisfies MarketProductsScrollRestorationTypes;

  try {
    markCurrentHistoryEntry(state.marketSlug, restorationId);
    window.sessionStorage.setItem(getStorageKey(state.marketSlug), JSON.stringify(nextState));
  } catch {
    return;
  }
};

export const consumePendingMarketProductsScrollRestoration = (marketSlug: string) => {
  const storedState = readStoredState(marketSlug);
  const historyEntry = readCurrentHistoryEntry();

  if (
    storedState == null ||
    historyEntry?.marketSlug !== marketSlug ||
    historyEntry.restorationId !== storedState.restorationId
  ) {
    return null;
  }

  return storedState;
};

export const clearMarketProductsScrollRestoration = (marketSlug: string) => {
  removeStoredState(marketSlug);
  removeCurrentHistoryEntry(marketSlug);
};
