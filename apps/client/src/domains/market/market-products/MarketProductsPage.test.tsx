import { QueryClient } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatBusinessDays } from '@dongchimi/shared/business-hours';
import { act, renderWithProviders, screen, server, userEvent, waitFor, within } from '@/test';

import { MarketProductsPage } from './MarketProductsPage';
import { DAILY_PRODUCTS_API_RESPONSE_FIXTURE } from '../api/daily-products-api.mock';
import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from '../api/market-detail-api.mock';
import type { BusinessHourTypes } from '../model/market-detail-schema';
import { calculateFirstRowCategoryCount } from './hooks/useEventDiscountCategoryLayout';
import { formatPrice } from './utils/format-price';
import { getCurrentBusinessCloseTime } from './utils/market-actions';

const router = {
  back: vi.fn(),
  push: vi.fn(),
};

const MARKET_SLUG = 'mangwon-fresh';
const MARKET_DETAIL_API_PATH = `${window.location.origin}/api/markets/:slug`;
const DAILY_PRODUCTS_API_PATH = `${window.location.origin}/api/markets/products/daily`;

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

const renderMarketProductsPage = async () => {
  renderWithProviders(<MarketProductsPage marketSlug={MARKET_SLUG} />);

  await screen.findByRole('heading', { name: MARKET_DETAIL_API_RESPONSE_FIXTURE.data.name });
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
    router.back.mockClear();
    router.push.mockClear();
    intersectionObserverCallback = undefined;
    intersectionObserverOptions = undefined;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    server.use(
      http.get(MARKET_DETAIL_API_PATH, ({ params }) => {
        if (params.slug !== MARKET_SLUG) {
          return HttpResponse.json({ message: '마트를 찾을 수 없어요.' }, { status: 404 });
        }

        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
      http.get(DAILY_PRODUCTS_API_PATH, ({ request }) => {
        const requestUrl = new URL(request.url);

        if (
          requestUrl.searchParams.get('marketId') !==
          String(MARKET_DETAIL_API_RESPONSE_FIXTURE.data.marketId)
        ) {
          return HttpResponse.json({ message: '잘못된 마트 식별자입니다.' }, { status: 400 });
        }

        return HttpResponse.json(DAILY_PRODUCTS_API_RESPONSE_FIXTURE);
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('API로 조회한 마트 정보와 전단 섹션을 렌더링한다', async () => {
    await renderMarketProductsPage();

    expect(screen.getByRole('heading', { name: '전단보기' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '망원 신선마트' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '지금 가장 인기 있는 상품 TOP 3' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 할인 상품' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '삼겹살 500g 6,900원 상품 보기' })).toHaveAttribute(
      'href',
      '/markets/mangwon-fresh/products/101',
    );
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

    server.use(
      http.get(MARKET_DETAIL_API_PATH, () => {
        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(
      await screen.findByRole('heading', { name: MARKET_DETAIL_API_RESPONSE_FIXTURE.data.name }),
    ).toBeInTheDocument();
  });

  it('검증되지 않은 마트 상세 응답은 재시도하지 않고 오류를 표시한다', async () => {
    let requestCount = 0;

    server.use(
      http.get(MARKET_DETAIL_API_PATH, () => {
        requestCount += 1;

        return HttpResponse.json({
          code: 'SUCCESS',
          data: {},
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    renderWithProviders(<MarketProductsPage marketSlug={MARKET_SLUG} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('마트 정보를 불러오지 못했어요.');
    expect(requestCount).toBe(1);
  });

  it('opens the call confirmation modal', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();

    await user.click(screen.getByRole('button', { name: '전화걸기' }));

    const dialog = await screen.findByRole('dialog', { name: '망원 신선마트에 전화할까요?' });

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('02-123-4567')).toBeInTheDocument();
  });

  it('toggles today special products', async () => {
    const user = userEvent.setup();
    const expandedProducts = [
      ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE.data.products,
      ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE.data.products.map((product, index) => ({
        ...product,
        name: `${product.name} 추가`,
        productId: product.productId + index + 100,
      })),
    ];

    server.use(
      http.get(DAILY_PRODUCTS_API_PATH, () => {
        return HttpResponse.json({
          ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE,
          data: {
            products: expandedProducts,
            totalCount: expandedProducts.length,
          },
        });
      }),
    );

    await renderMarketProductsPage();

    const toggleButton = await screen.findByRole('button', { name: '등록한 상품 전체보기' });
    const todaySection = getSectionQueries('오늘의 특가 상품');

    expect(todaySection.getByText(`${expandedProducts.length}건`)).toBeInTheDocument();
    expect(todaySection.getAllByRole('link')).toHaveLength(2);
    expect(toggleButton).toHaveAttribute('aria-controls', 'today-special-products-list');
    expect(document.getElementById('today-special-products-list')).toBeInTheDocument();

    await user.click(toggleButton);

    expect(todaySection.getAllByRole('link')).toHaveLength(expandedProducts.length);

    await user.click(screen.getByRole('button', { name: '접기' }));

    expect(todaySection.getAllByRole('link')).toHaveLength(2);
  });

  it('오늘의 특가 조회 중 loading 상태를 표시한다', async () => {
    server.use(
      http.get(DAILY_PRODUCTS_API_PATH, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));

        return HttpResponse.json(DAILY_PRODUCTS_API_RESPONSE_FIXTURE);
      }),
    );

    renderWithProviders(<MarketProductsPage marketSlug={MARKET_SLUG} />);

    await screen.findByRole('heading', { name: MARKET_DETAIL_API_RESPONSE_FIXTURE.data.name });
    expect(screen.getByRole('status')).toHaveTextContent('오늘의 특가 상품을 불러오는 중이에요.');
    await screen.findByText('2건');
    expect(getSectionQueries('오늘의 특가 상품').getByText('2건')).toBeInTheDocument();
  });

  it('오늘의 특가 API가 빈 목록을 반환하면 0건 empty 상태를 표시한다', async () => {
    server.use(
      http.get(DAILY_PRODUCTS_API_PATH, () => {
        return HttpResponse.json({
          ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE,
          data: {
            products: [],
            totalCount: 0,
          },
        });
      }),
    );

    await renderMarketProductsPage();

    await screen.findByText('등록된 오늘의 특가 상품이 없어요.');
    const todaySection = getSectionQueries('오늘의 특가 상품');

    expect(todaySection.getByText('0건')).toBeInTheDocument();
    expect(todaySection.getByText('등록된 오늘의 특가 상품이 없어요.')).toBeInTheDocument();
    expect(todaySection.queryByRole('link')).not.toBeInTheDocument();
    expect(
      todaySection.queryByRole('button', { name: '등록한 상품 전체보기' }),
    ).not.toBeInTheDocument();
  });

  it('오늘의 특가 조회 실패 시 오류와 재시도 action을 표시한다', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    server.use(
      http.get(DAILY_PRODUCTS_API_PATH, () => {
        return HttpResponse.json({ message: '조회에 실패했습니다.' }, { status: 500 });
      }),
    );

    renderWithProviders(<MarketProductsPage marketSlug={MARKET_SLUG} />, { queryClient });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '오늘의 특가 상품을 불러오지 못했어요.',
    );

    server.use(
      http.get(DAILY_PRODUCTS_API_PATH, () => {
        return HttpResponse.json(DAILY_PRODUCTS_API_RESPONSE_FIXTURE);
      }),
    );

    await user.click(screen.getByRole('button', { name: '오늘의 특가 다시 시도' }));

    expect(await getSectionQueries('오늘의 특가 상품').findByText('2건')).toBeInTheDocument();
  });

  it('shows a bottom-center toast when leaflet link copy succeeds', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    mockClipboardWriteText(writeText);
    await renderMarketProductsPage();

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

    await renderMarketProductsPage();

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    const dialog = await screen.findByRole('dialog', { name: '전단 공유하기' });

    await user.click(within(dialog).getByRole('button', { name: '카카오톡으로 공유' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('아직 준비중인 기능이에요.');
    expect(within(dialog).getByRole('region', { name: '토스트 알림' })).toBeInTheDocument();
  });

  it('filters event discount products by category', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    await user.click(eventSection.getByRole('button', { name: '정육·달걀' }));

    expect(eventSection.getAllByRole('link')).toHaveLength(3);
    expect(eventSection.queryByText('대추방울토마토 500G')).not.toBeInTheDocument();

    const moreButton = eventSection.getByRole('button', { name: '더보기' });

    expect(moreButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(moreButton);

    expect(moreButton).toHaveAttribute('aria-expanded', 'true');
    expect(eventSection.queryByRole('button', { name: '접기' })).not.toBeInTheDocument();

    await user.click(eventSection.getByRole('button', { name: '수산' }));

    expect(eventSection.getAllByRole('link')).toHaveLength(1);
    expect(eventSection.getByText('손질 고등어 1팩')).toBeInTheDocument();
  });

  it('appends the next event discount page when the load-more sentinel intersects', async () => {
    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(eventSection.getAllByRole('link')).toHaveLength(9);

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
      expect(eventSection.getAllByRole('link')).toHaveLength(18);
    });

    expect(eventSection.getByText('양배추 1통')).toBeInTheDocument();
    expect(eventSection.getByText('주방 수세미')).toBeInTheDocument();
  });

  it('resets event discount pagination when the category changes', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

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
      expect(eventSection.getAllByRole('link')).toHaveLength(18);
    });

    await user.click(eventSection.getByRole('button', { name: '정육·달걀' }));

    expect(eventSection.getAllByRole('link')).toHaveLength(3);
    expect(eventSection.queryByText('특란 30구')).not.toBeInTheDocument();
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
