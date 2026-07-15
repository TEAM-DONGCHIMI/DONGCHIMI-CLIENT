import { QueryClient } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { act, renderWithProviders, screen, server, userEvent, waitFor, within } from '@/test';

import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from '../api/market-detail-api.mock';
import {
  PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE,
  PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE,
} from '../api/periodic-products-api.mock';
import type { BusinessHourTypes } from '../model/market-detail-schema';
import { MarketProductsPage } from './MarketProductsPage';
import { marketProductsFixture } from './fixtures/market-products.fixture';
import { calculateFirstRowCategoryCount } from './hooks/useEventDiscountCategoryLayout';
import { formatBusinessDays } from './sections/MarketOverviewSection';
import { formatPrice } from './utils/format-price';
import { getCurrentBusinessCloseTime } from './utils/market-actions';

const router = {
  back: vi.fn(),
  push: vi.fn(),
};

const MARKET_SLUG = 'mangwon-fresh';
const MARKET_DETAIL_API_PATH = `${window.location.origin}/api/markets/:slug`;
const PERIODIC_PRODUCTS_API_PATH = `${window.location.origin}/api/markets/products/periodic`;

const categoryProducts = {
  MEAT_EGG: [
    {
      discountedPrice: 4900,
      name: '삼겹살 500G',
      productId: 402,
      thumbnailUrl: null,
    },
  ],
  SEAFOOD: [
    {
      discountedPrice: 6900,
      name: '손질 고등어 1팩',
      productId: 401,
      thumbnailUrl: null,
    },
  ],
} as const;

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

const useMarketDetailHandler = () => {
  server.use(
    http.get(MARKET_DETAIL_API_PATH, ({ params }) => {
      if (params.slug !== MARKET_SLUG) {
        return HttpResponse.json({ message: '마트를 찾을 수 없어요.' }, { status: 404 });
      }

      return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
    }),
  );
};

const usePeriodicProductsHandler = () => {
  server.use(
    http.get(PERIODIC_PRODUCTS_API_PATH, ({ request }) => {
      const searchParams = new URL(request.url).searchParams;
      const category = searchParams.get('category');
      const cursor = searchParams.get('cursor');

      expect(searchParams.get('marketId')).toBe(
        String(MARKET_DETAIL_API_RESPONSE_FIXTURE.data.marketId),
      );

      if (cursor != null) {
        return HttpResponse.json(PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE);
      }

      if (category === 'MEAT_EGG' || category === 'SEAFOOD') {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: {
            availableCategories:
              PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE.data.availableCategories,
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

const renderMarketProductsPage = async () => {
  renderWithProviders(<MarketProductsPage marketSlug={MARKET_SLUG} />);

  await screen.findByRole('heading', { name: MARKET_DETAIL_API_RESPONSE_FIXTURE.data.name });
};

const getSectionQueries = (headingName: string) => {
  const section = screen.getByRole('heading', { name: headingName }).closest('section');

  expect(section).not.toBeNull();

  return within(section as HTMLElement);
};

describe('MarketProductsPage', () => {
  beforeEach(() => {
    router.back.mockClear();
    router.push.mockClear();
    intersectionObserverCallback = undefined;
    intersectionObserverOptions = undefined;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    useMarketDetailHandler();
    usePeriodicProductsHandler();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('API로 조회한 마트의 marketId로 행사 할인 상품을 렌더링한다', async () => {
    await renderMarketProductsPage();

    expect(screen.getByRole('heading', { name: '전단보기' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '망원 신선마트' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '지금 가장 인기 있는 상품 TOP 3' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 할인 상품' })).toBeInTheDocument();
    expect(await screen.findByText('대추방울토마토 500G')).toBeInTheDocument();
  });

  it('마트 상세 조회 중 loading 상태를 표시한다', async () => {
    server.use(
      http.get(MARKET_DETAIL_API_PATH, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));

        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    renderWithProviders(<MarketProductsPage marketSlug={MARKET_SLUG} />);

    expect(screen.getByRole('status')).toHaveTextContent('마트 정보를 불러오는 중이에요.');
    expect(
      await screen.findByRole('heading', { name: MARKET_DETAIL_API_RESPONSE_FIXTURE.data.name }),
    ).toBeInTheDocument();
  });

  it('마트 상세 조회 실패 시 오류와 재시도 action을 표시한다', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    server.use(
      http.get(MARKET_DETAIL_API_PATH, () => {
        return HttpResponse.json({ message: '마트를 찾을 수 없어요.' }, { status: 404 });
      }),
    );

    renderWithProviders(<MarketProductsPage marketSlug={MARKET_SLUG} />, { queryClient });

    expect(await screen.findByRole('alert')).toHaveTextContent('마트 정보를 불러오지 못했어요.');

    useMarketDetailHandler();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(
      await screen.findByRole('heading', { name: MARKET_DETAIL_API_RESPONSE_FIXTURE.data.name }),
    ).toBeInTheDocument();
  });

  it('오늘의 특가 상품을 펼치고 접는다', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();

    const todaySection = getSectionQueries('오늘의 특가 상품');
    const toggleButton = screen.getByRole('button', { name: '등록한 상품 전체보기' });

    expect(
      todaySection.getByText(`${marketProductsFixture.todaySpecial.products.length}건`),
    ).toBeInTheDocument();
    expect(todaySection.getAllByRole('link')).toHaveLength(2);

    await user.click(toggleButton);
    expect(todaySection.getAllByRole('link')).toHaveLength(9);

    await user.click(screen.getByRole('button', { name: '접기' }));
    expect(todaySection.getAllByRole('link')).toHaveLength(2);
  });

  it('행사 할인 상품을 서버 category enum으로 필터링한다', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    await user.click(await eventSection.findByRole('button', { name: '정육·달걀' }));

    expect(await eventSection.findByText('삼겹살 500G')).toBeInTheDocument();
    expect(eventSection.getAllByRole('link')).toHaveLength(1);
    expect(eventSection.queryByText('대추방울토마토 500G')).not.toBeInTheDocument();

    const moreButton = eventSection.getByRole('button', { name: '더보기' });
    await user.click(moreButton);

    expect(moreButton).toHaveAttribute('aria-expanded', 'true');

    await user.click(eventSection.getByRole('button', { name: '수산물' }));

    expect(await eventSection.findByText('손질 고등어 1팩')).toBeInTheDocument();
    expect(eventSection.getAllByRole('link')).toHaveLength(1);
  });

  it('상품이 존재하는 availableCategories만 카테고리로 노출한다', async () => {
    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: {
            availableCategories: ['MEAT_EGG'],
            content: categoryProducts.MEAT_EGG,
            hasNext: false,
            nextCursor: null,
          },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(await eventSection.findByRole('button', { name: '정육·달걀' })).toBeInTheDocument();
    expect(eventSection.queryByRole('button', { name: '채소·과일' })).not.toBeInTheDocument();
    expect(eventSection.queryByRole('button', { name: '수산물' })).not.toBeInTheDocument();
    expect(eventSection.queryByRole('button', { name: '더보기' })).not.toBeInTheDocument();
  });

  it('sentinel이 교차하면 다음 cursor 페이지를 한 번만 추가한다', async () => {
    let nextPageRequestCount = 0;

    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, async ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');

        if (cursor != null) {
          nextPageRequestCount += 1;
          await new Promise((resolve) => setTimeout(resolve, 20));

          return HttpResponse.json(PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE);
        }

        return HttpResponse.json(PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE);
      }),
    );

    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(await eventSection.findByText('대추방울토마토 500G')).toBeInTheDocument();

    await waitFor(() => {
      expect(intersectionObserverCallback).toBeTypeOf('function');
    });

    expect(intersectionObserverOptions).toMatchObject({ rootMargin: '0px 0px 240px' });

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

    expect(await eventSection.findByText('양배추 1통')).toBeInTheDocument();
    expect(nextPageRequestCount).toBe(1);
  });

  it('중간 빈 페이지에 hasNext가 있으면 최종 빈 상태로 표시하지 않는다', async () => {
    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: {
            availableCategories:
              PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE.data.availableCategories,
            content: [],
            hasNext: true,
            nextCursor: 10,
          },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    await renderMarketProductsPage();

    expect(await screen.findByRole('status')).toHaveTextContent('행사 상품을 더 찾고 있어요.');
    expect(screen.queryByText('해당 카테고리에 등록된 상품이 없어요.')).not.toBeInTheDocument();
  });

  it('마지막 페이지까지 상품이 없으면 빈 상태를 표시한다', async () => {
    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: { availableCategories: [], content: [], hasNext: false, nextCursor: null },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    await renderMarketProductsPage();

    expect(await screen.findByText('해당 카테고리에 등록된 상품이 없어요.')).toBeInTheDocument();
  });

  it('다음 페이지 실패 시 기존 상품을 유지하고 재시도한다', async () => {
    const user = userEvent.setup();
    let shouldFailNextPage = true;

    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');

        if (cursor != null && shouldFailNextPage) {
          shouldFailNextPage = false;
          return HttpResponse.json({ message: 'Bad request' }, { status: 400 });
        }

        return HttpResponse.json(
          cursor == null
            ? PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE
            : PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE,
        );
      }),
    );

    await renderMarketProductsPage();

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
  });
});

describe('calculateFirstRowCategoryCount', () => {
  it('모든 카테고리가 들어가면 더보기 공간을 예약하지 않는다', () => {
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

  it('카테고리가 넘치면 더보기 chip 공간을 예약한다', () => {
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
  it('연속된 영업일을 범위로 표시한다', () => {
    expect(formatBusinessDays(['FRIDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'])).toBe('화-금');
  });

  it('연속되지 않은 영업일은 각각 표시한다', () => {
    expect(formatBusinessDays(['MONDAY', 'WEDNESDAY', 'FRIDAY'])).toBe('월요일, 수요일, 금요일');
  });
});

describe('formatPrice', () => {
  it('가격에 천 단위 구분자를 표시한다', () => {
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

  it('현재 영업일의 종료 시간을 반환한다', () => {
    expect(getCurrentBusinessCloseTime(businessHours, new Date(2026, 6, 11))).toBe('22:00');
  });

  it('현재 휴무일이면 종료 시간을 반환하지 않는다', () => {
    expect(getCurrentBusinessCloseTime(businessHours, new Date(2026, 6, 12))).toBeUndefined();
  });
});
