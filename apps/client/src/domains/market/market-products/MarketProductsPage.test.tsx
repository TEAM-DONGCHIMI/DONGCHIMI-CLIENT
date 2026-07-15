import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { act, renderWithProviders, screen, server, userEvent, waitFor, within } from '@/test';

import {
  PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE,
  PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE,
} from '../api/periodic-products-api.mock';
import { MarketProductsPage } from './MarketProductsPage';
import { marketProductsFixture, type BusinessHourTypes } from './fixtures/market-products.fixture';
import { calculateFirstRowCategoryCount } from './hooks/useEventDiscountCategoryLayout';
import { formatBusinessDays } from './sections/MarketOverviewSection';
import { formatPrice } from './utils/format-price';
import { getCurrentBusinessCloseTime } from './utils/market-actions';

const router = {
  back: vi.fn(),
  push: vi.fn(),
};

const API_BASE_URL = 'https://api.test';
const PERIODIC_PRODUCTS_ENDPOINT = `${API_BASE_URL}${API_ENDPOINTS.user.products.periodic(1)}`;

const categoryProducts = {
  SEAFOOD: [
    {
      discountedPrice: 6900,
      name: '손질 고등어 1팩',
      productId: 401,
      thumbnailUrl: null,
    },
  ],
  MEAT_EGG: [
    {
      discountedPrice: 4900,
      name: '삼겹살 500G',
      productId: 402,
      thumbnailUrl: null,
    },
  ],
} as const;

const useDefaultPeriodicProductsHandler = () => {
  server.use(
    http.get(PERIODIC_PRODUCTS_ENDPOINT, ({ request }) => {
      const requestUrl = new URL(request.url);
      const category = requestUrl.searchParams.get('category');
      const cursor = requestUrl.searchParams.get('cursor');

      if (cursor != null) {
        return HttpResponse.json(PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE);
      }

      if (category === 'MEAT_EGG' || category === 'SEAFOOD') {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: {
            content: categoryProducts[category],
            hasNext: false,
            nextCursor: null,
          },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }

      return HttpResponse.json(PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE);
    }),
  );
};

let intersectionObserverCallback: IntersectionObserverCallback | undefined;
let intersectionObserverOptions: IntersectionObserverInit | undefined;

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds = [0];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    intersectionObserverCallback = callback;
    intersectionObserverOptions = options;
    this.rootMargin = options?.rootMargin ?? '0px';
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

const renderMarketProductsPage = () => {
  return renderWithProviders(<MarketProductsPage marketId='mangwon-fresh' />);
};

const mockClipboardWriteText = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText,
    },
  });
};

const getSectionQueries = (headingName: string) => {
  const section = screen.getByRole('heading', { name: headingName }).closest('section');

  expect(section).not.toBeNull();

  return within(section as HTMLElement);
};

describe('MarketProductsPage', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', API_BASE_URL);
    router.back.mockClear();
    router.push.mockClear();
    intersectionObserverCallback = undefined;
    intersectionObserverOptions = undefined;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    useDefaultPeriodicProductsHandler();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('renders market leaflet sections', () => {
    renderMarketProductsPage();

    expect(screen.getByRole('heading', { name: '전단보기' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '망원 신선마트' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '지금 가장 인기 있는 상품 TOP 3' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 할인 상품' })).toBeInTheDocument();
  });

  it('opens the call confirmation modal', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    await user.click(screen.getByRole('button', { name: '전화걸기' }));

    const dialog = await screen.findByRole('dialog', { name: '망원 신선마트에 전화할까요?' });

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('02-123-4567')).toBeInTheDocument();
  });

  it('toggles today special products', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    const todaySection = getSectionQueries('오늘의 특가 상품');
    const toggleButton = screen.getByRole('button', { name: '등록한 상품 전체보기' });

    expect(
      todaySection.getByText(`${marketProductsFixture.todaySpecial.products.length}건`),
    ).toBeInTheDocument();
    expect(todaySection.getAllByRole('link')).toHaveLength(2);
    expect(toggleButton).toHaveAttribute('aria-controls', 'today-special-products-list');
    expect(document.getElementById('today-special-products-list')).toBeInTheDocument();

    await user.click(toggleButton);

    expect(todaySection.getAllByRole('link')).toHaveLength(9);

    await user.click(screen.getByRole('button', { name: '접기' }));

    expect(todaySection.getAllByRole('link')).toHaveLength(2);
  });

  it('shows a bottom-center toast when leaflet link copy succeeds', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    mockClipboardWriteText(writeText);
    renderMarketProductsPage();

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    const dialog = await screen.findByRole('dialog', { name: '전단 공유하기' });

    await user.click(within(dialog).getByRole('button', { name: '링크 복사' }));

    expect(writeText).toHaveBeenCalledWith('dongchimi.kr/mangwon-fresh');
    expect(await within(dialog).findByRole('status')).toHaveTextContent(
      '전단 링크가 복사되었습니다.',
    );
    expect(within(dialog).getByRole('region', { name: '토스트 알림' })).toBeInTheDocument();
  });

  it('shows a pending toast when kakao share is selected', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    const dialog = await screen.findByRole('dialog', { name: '전단 공유하기' });

    await user.click(within(dialog).getByRole('button', { name: '카카오톡으로 공유' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('아직 준비중인 기능이에요.');
    expect(within(dialog).getByRole('region', { name: '토스트 알림' })).toBeInTheDocument();
  });

  it('filters event discount products by category', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    await user.click(eventSection.getByRole('button', { name: '정육·달걀' }));

    expect(await eventSection.findByText('삼겹살 500G')).toBeInTheDocument();
    expect(eventSection.getAllByRole('link')).toHaveLength(1);
    expect(eventSection.queryByText('대추방울토마토 500G')).not.toBeInTheDocument();

    const moreButton = eventSection.getByRole('button', { name: '더보기' });

    expect(moreButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(moreButton);

    expect(moreButton).toHaveAttribute('aria-expanded', 'true');
    expect(eventSection.queryByRole('button', { name: '접기' })).not.toBeInTheDocument();

    await user.click(eventSection.getByRole('button', { name: '수산물' }));

    expect(await eventSection.findByText('손질 고등어 1팩')).toBeInTheDocument();
    expect(eventSection.getAllByRole('link')).toHaveLength(1);
  });

  it('sends the server ProductCategory enum for every event discount category', async () => {
    const user = userEvent.setup();
    const requestedCategories: (string | null)[] = [];
    const categories = [
      ['채소·과일', 'VEGETABLE_FRUIT'],
      ['정육·달걀', 'MEAT_EGG'],
      ['수산물', 'SEAFOOD'],
      ['유제품', 'DAIRY'],
      ['간편식', 'CONVENIENCE_FOOD'],
      ['가공식품', 'PROCESSED_FOOD'],
      ['음료·주류', 'BEVERAGE_ALCOHOL'],
      ['생활용품', 'HOUSEHOLD_GOODS'],
      ['기타', 'ETC'],
    ] as const;

    server.use(
      http.get(PERIODIC_PRODUCTS_ENDPOINT, ({ request }) => {
        requestedCategories.push(new URL(request.url).searchParams.get('category'));

        return HttpResponse.json({
          code: 'SUCCESS',
          data: { content: [], hasNext: false, nextCursor: null },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    await user.click(eventSection.getByRole('button', { name: '더보기' }));

    for (const [label, apiCategory] of categories) {
      await user.click(eventSection.getByRole('button', { name: label }));

      await waitFor(() => {
        expect(requestedCategories.at(-1)).toBe(apiCategory);
      });
    }
  });

  it('appends the next event discount page when the load-more sentinel intersects', async () => {
    renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(await eventSection.findByText('대추방울토마토 500G')).toBeInTheDocument();
    expect(eventSection.getAllByRole('link')).toHaveLength(2);

    await waitFor(() => {
      expect(intersectionObserverCallback).toBeTypeOf('function');
    });

    expect(intersectionObserverOptions).toMatchObject({
      rootMargin: '0px 0px 240px',
    });

    act(() => {
      intersectionObserverCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
      intersectionObserverCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    await waitFor(() => {
      expect(eventSection.getAllByRole('link')).toHaveLength(3);
    });

    expect(eventSection.getByText('양배추 1통')).toBeInTheDocument();
  });

  it('resets event discount pagination when the category changes', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(await eventSection.findByText('대추방울토마토 500G')).toBeInTheDocument();

    await waitFor(() => {
      expect(intersectionObserverCallback).toBeTypeOf('function');
    });

    act(() => {
      intersectionObserverCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    await waitFor(() => {
      expect(eventSection.getAllByRole('link')).toHaveLength(3);
    });

    await user.click(eventSection.getByRole('button', { name: '정육·달걀' }));

    expect(await eventSection.findByText('삼겹살 500G')).toBeInTheDocument();
    expect(eventSection.getAllByRole('link')).toHaveLength(1);
    expect(eventSection.queryByText('양배추 1통')).not.toBeInTheDocument();
  });

  it('shows an empty state when the API returns no event discount products', async () => {
    server.use(
      http.get(PERIODIC_PRODUCTS_ENDPOINT, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: { content: [], hasNext: false, nextCursor: null },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    renderMarketProductsPage();

    expect(await screen.findByText('해당 카테고리에 등록된 상품이 없어요.')).toBeInTheDocument();
  });

  it('retries the initial event discount request after an auth error', async () => {
    const user = userEvent.setup();
    let shouldFail = true;

    server.use(
      http.get(PERIODIC_PRODUCTS_ENDPOINT, () => {
        if (shouldFail) {
          shouldFail = false;
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return HttpResponse.json(PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE);
      }),
    );

    renderMarketProductsPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('행사 상품을 불러오지 못했어요.');

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('대추방울토마토 500G')).toBeInTheDocument();
  });

  it('keeps loaded products and retries when the next page request fails', async () => {
    const user = userEvent.setup();
    let shouldFailNextPage = true;

    server.use(
      http.get(PERIODIC_PRODUCTS_ENDPOINT, ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');

        if (cursor != null && shouldFailNextPage) {
          shouldFailNextPage = false;
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return HttpResponse.json(
          cursor == null
            ? PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE
            : PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE,
        );
      }),
    );

    renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(await eventSection.findByText('대추방울토마토 500G')).toBeInTheDocument();

    act(() => {
      intersectionObserverCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(await eventSection.findByText('상품을 더 불러오지 못했어요.')).toBeInTheDocument();
    expect(eventSection.getByText('삼겹살 500G')).toBeInTheDocument();

    await user.click(eventSection.getByRole('button', { name: '다시 시도' }));

    expect(await eventSection.findByText('양배추 1통')).toBeInTheDocument();
    expect(eventSection.getAllByRole('link')).toHaveLength(3);
  });
});

describe('calculateFirstRowCategoryCount', () => {
  it('returns every category count when all category chips fit without the more chip', () => {
    expect(
      calculateFirstRowCategoryCount({
        allCategoryWidth: 48,
        categoryWidths: [64, 80, 72],
        containerWidth: 280,
        gap: 4,
        moreCategoryWidth: 72,
      }),
    ).toBe(3);
  });

  it('reserves space for the more chip when categories overflow the first row', () => {
    expect(
      calculateFirstRowCategoryCount({
        allCategoryWidth: 48,
        categoryWidths: [64, 80, 72],
        containerWidth: 220,
        gap: 4,
        moreCategoryWidth: 72,
      }),
    ).toBe(1);
  });
});

describe('formatBusinessDays', () => {
  it('formats continuous business days as a range', () => {
    expect(formatBusinessDays(['FRIDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'])).toBe('화-금');
  });

  it('does not format non-continuous business days as a single range', () => {
    expect(formatBusinessDays(['MONDAY', 'WEDNESDAY', 'FRIDAY'])).toBe('월요일, 수요일, 금요일');
  });
});

describe('formatPrice', () => {
  it('formats a price with Korean number grouping', () => {
    expect(formatPrice(1234567)).toBe('1,234,567');
  });
});

describe('getCurrentBusinessCloseTime', () => {
  const businessHours = [
    {
      close: '20:00',
      days: ['MONDAY', 'TUESDAY'],
      isOpen: true,
      open: '10:00',
    },
    {
      close: '22:00',
      days: ['SATURDAY'],
      isOpen: true,
      open: '12:00',
    },
    {
      days: ['SUNDAY'],
      isOpen: false,
    },
  ] satisfies BusinessHourTypes[];

  it('returns the close time for the current business day', () => {
    expect(getCurrentBusinessCloseTime(businessHours, new Date(2026, 6, 11))).toBe('22:00');
  });

  it('returns undefined when the current business day is closed', () => {
    expect(getCurrentBusinessCloseTime(businessHours, new Date(2026, 6, 12))).toBeUndefined();
  });
});
