import { QueryClient } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatBusinessDays } from '@dongchimi/shared/business-hours';
import {
  act,
  fireEvent,
  renderWithProviders,
  screen,
  server,
  userEvent,
  waitFor,
  within,
} from '@/test';

import { DAILY_PRODUCTS_API_RESPONSE_FIXTURE } from '../api/daily-products-api.mock';
import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from '../api/market-detail-api.mock';
import {
  PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE,
  PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE,
} from '../api/periodic-products-api.mock';
import type { BusinessHourTypes } from '../model/market-detail-schema';
import { marketQueryKeys } from '../query-keys';
import { MarketProductsPage } from './MarketProductsPage';
import {
  clearMarketProductsScrollRestoration,
  consumePendingMarketProductsScrollRestoration,
  getMarketProductAnchorId,
  saveMarketProductsScrollRestoration,
} from './hooks/market-products-scroll-restoration';
import { calculateFirstRowCategoryCount } from './hooks/useEventDiscountCategoryLayout';
import { PopularProductsSection } from './sections/PopularProductsSection';
import { TodaySpecialProductsSection } from './sections/TodaySpecialProductsSection';
import { formatPrice } from './utils/format-price';
import { getCurrentBusinessCloseTime, getShareUrl } from './utils/market-actions';

const router = {
  back: vi.fn(),
  push: vi.fn(),
};

const MARKET_SLUG = 'mangwon-fresh';
const MARKET_DETAIL_API_PATH = `${window.location.origin}/api/markets/:slug`;
const DAILY_PRODUCTS_API_PATH = `${window.location.origin}/api/markets/products/daily`;
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

const mockClipboardWriteText = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
};

const createBeforeInstallPromptEvent = () => {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  const prompt = vi.fn().mockResolvedValue(undefined);

  Object.assign(event, {
    prompt,
    userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
  });

  return { event, prompt };
};

const getSectionQueries = (headingName: string) => {
  const section = screen.getByRole('heading', { name: headingName }).closest('section');

  expect(section).not.toBeNull();

  return within(section as HTMLElement);
};

const useTimerAnimationFrame = () => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    return window.setTimeout(() => callback(performance.now()), 16);
  });
  vi.stubGlobal('cancelAnimationFrame', (animationFrameId: number) => {
    window.clearTimeout(animationFrameId);
  });
};

describe('MarketProductsPage', () => {
  beforeEach(() => {
    router.back.mockClear();
    router.push.mockClear();
    intersectionObserverCallback = undefined;
    intersectionObserverOptions = undefined;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    clearMarketProductsScrollRestoration(MARKET_SLUG);
    window.sessionStorage.clear();
    window.history.replaceState({}, '', `/markets/${MARKET_SLUG}`);
    useMarketDetailHandler();
    usePeriodicProductsHandler();
    server.use(
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
    vi.restoreAllMocks();
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

  it('할인율이 0인 인기 상품과 오늘의 특가 상품에는 할인율 chip을 표시하지 않는다', () => {
    const popularProducts = MARKET_DETAIL_API_RESPONSE_FIXTURE.data.top3.map((product, index) => ({
      ...product,
      discountRate: index === 0 ? 0 : product.discountRate,
    }));
    const todaySpecialProducts = DAILY_PRODUCTS_API_RESPONSE_FIXTURE.data.products.map(
      (product, index) => ({
        ...product,
        discountRate: index === 0 ? 0 : product.discountRate,
      }),
    );

    renderWithProviders(
      <>
        <PopularProductsSection marketSlug={MARKET_SLUG} products={popularProducts} />
        <TodaySpecialProductsSection
          marketSlug={MARKET_SLUG}
          products={todaySpecialProducts}
          totalCount={todaySpecialProducts.length}
        />
      </>,
    );

    const popularSection = getSectionQueries('지금 가장 인기 있는 상품 TOP 3');
    const todaySection = getSectionQueries('오늘의 특가 상품');

    expect(popularSection.queryByText('0%')).not.toBeInTheDocument();
    expect(todaySection.queryByText('0%')).not.toBeInTheDocument();
    expect(popularSection.getByText('15%')).toBeInTheDocument();
    expect(todaySection.getByText('20%')).toBeInTheDocument();
  });

  it('TOP3 상품을 클릭하면 상품 상대 위치를 저장한다', async () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(360);
    await renderMarketProductsPage();

    const popularSection = getSectionQueries('지금 가장 인기 있는 상품 TOP 3');
    const productLink = popularSection.getByRole('link', {
      name: '삼겹살 500g 6,900원 상품 보기',
    });

    vi.spyOn(productLink, 'getBoundingClientRect').mockReturnValue({
      bottom: 196,
      height: 100,
      left: 0,
      right: 100,
      toJSON: () => ({}),
      top: 96,
      width: 100,
      x: 0,
      y: 96,
    });
    productLink.addEventListener('click', (event) => event.preventDefault(), { once: true });

    fireEvent.click(productLink);

    expect(consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toMatchObject({
      anchorId: getMarketProductAnchorId('popular', 101),
      productId: '101',
      scrollY: 360,
      section: 'popular',
      viewportTop: 96,
    });
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

  it('전화걸기 확인 modal을 연다', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();
    await user.click(screen.getByRole('button', { name: '전화걸기' }));

    const dialog = await screen.findByRole('dialog', { name: '망원 신선마트에 전화할까요?' });

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('02-123-4567')).toBeInTheDocument();
  });

  it('오늘의 특가 상품을 펼치고 접는다', async () => {
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

    await user.click(toggleButton);

    expect(todaySection.getAllByRole('link')).toHaveLength(expandedProducts.length);

    await user.click(screen.getByRole('button', { name: '접기' }));
    expect(todaySection.getAllByRole('link')).toHaveLength(2);
  });

  it('오늘의 특가 상세에서 뒤로오면 저장한 전체보기 상태를 먼저 복원한다', async () => {
    const restoredProduct = {
      ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE.data.products[0],
      name: '뒤로가기 복원 특가 상품',
      productId: 299,
    };
    const expandedProducts = [
      ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE.data.products,
      restoredProduct,
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
    useTimerAnimationFrame();
    saveMarketProductsScrollRestoration({
      anchorId: getMarketProductAnchorId('today-special', restoredProduct.productId),
      isExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: String(restoredProduct.productId),
      scrollY: 720,
      section: 'today-special',
      viewportTop: 0,
    });
    await renderMarketProductsPage();

    expect(await screen.findByText(restoredProduct.name)).toBeInTheDocument();

    const todaySection = getSectionQueries('오늘의 특가 상품');

    expect(todaySection.getAllByRole('link')).toHaveLength(expandedProducts.length);
    expect(todaySection.getByRole('button', { name: '접기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
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
    expect(getSectionQueries('오늘의 특가 상품').getByRole('status')).toHaveTextContent(
      '오늘의 특가 상품을 불러오는 중이에요.',
    );
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

    expect(writeText).toHaveBeenCalledWith('https://app.dongchiimi.com/markets/mangwon-fresh');
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

  it('closes the leaflet share sheet from the footer and restores focus to the trigger', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();

    const shareTrigger = screen.getByRole('button', { name: '공유하기' });

    await user.click(shareTrigger);

    const dialog = await screen.findByRole('dialog', { name: '전단 공유하기' });

    await user.click(within(dialog).getByRole('button', { name: '닫기' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '전단 공유하기' })).not.toBeInTheDocument();
    });
    expect(shareTrigger).toHaveFocus();
  });

  it('does not expose a native install CTA when the install prompt is available', async () => {
    const user = userEvent.setup();
    const { event, prompt } = createBeforeInstallPromptEvent();

    await renderMarketProductsPage();

    act(() => {
      window.dispatchEvent(event);
    });

    await user.click(screen.getByRole('button', { name: '공유하기' }));
    await user.click(
      within(await screen.findByRole('dialog', { name: '전단 공유하기' })).getByRole('button', {
        name: '앱으로 전단보기',
      }),
    );

    const installDialog = await screen.findByRole('dialog', {
      name: '홈 화면에 추가하기 안내',
    });

    expect(
      within(installDialog).getByRole('img', {
        name: '동치미 앱 아이콘이 표시된 홈 화면 예시',
      }),
    ).toBeVisible();
    expect(
      within(installDialog).queryByRole('button', { name: '홈 화면에 추가하기' }),
    ).not.toBeInTheDocument();
    expect(
      within(installDialog).getByRole('button', { name: '웹으로 계속 이용하기' }),
    ).toBeVisible();
    expect(prompt).not.toHaveBeenCalled();
  });

  it('shows the manual browser install path when the native prompt is unavailable', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();

    const shareButton = screen.getByRole('button', { name: '공유하기' });

    await user.click(shareButton);
    await user.click(
      within(await screen.findByRole('dialog', { name: '전단 공유하기' })).getByRole('button', {
        name: '앱으로 전단보기',
      }),
    );

    const installDialog = await screen.findByRole('dialog', {
      name: '홈 화면에 추가하기 안내',
    });

    expect(installDialog).toBeVisible();
    expect(
      within(installDialog).getByText(
        '브라우저의 공유 메뉴에서 ‘홈 화면에 추가’를 선택하면 앱처럼 편리하게 이용할 수 있어요.',
      ),
    ).toBeVisible();
    expect(within(installDialog).queryByRole('button', { name: '확인' })).toBeNull();

    await user.click(within(installDialog).getByRole('button', { name: '웹으로 계속 이용하기' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '홈 화면에 추가하기 안내' }),
      ).not.toBeInTheDocument();
    });
    expect(shareButton).toHaveFocus();
  });

  it('does not add an installed confirmation view to the install guide', async () => {
    const user = userEvent.setup();

    await renderMarketProductsPage();

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    await user.click(screen.getByRole('button', { name: '공유하기' }));
    await user.click(
      within(await screen.findByRole('dialog', { name: '전단 공유하기' })).getByRole('button', {
        name: '앱으로 전단보기',
      }),
    );

    const installDialog = await screen.findByRole('dialog', {
      name: '홈 화면에 추가하기 안내',
    });

    expect(installDialog).toBeVisible();
    expect(
      within(installDialog).queryByRole('button', { name: '홈 화면에 추가하기' }),
    ).not.toBeInTheDocument();
    expect(within(installDialog).queryByText(/이미 홈 화면에 추가되어/)).toBeNull();
    expect(within(installDialog).queryByRole('button', { name: '확인' })).toBeNull();
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

  it('카테고리 전환 요청 중 직전 상품 영역 높이를 유지한다', async () => {
    const user = userEvent.setup();
    let releaseCategoryRequest: (() => void) | undefined;
    const categoryRequest = new Promise<void>((resolve) => {
      releaseCategoryRequest = resolve;
    });

    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, async ({ request }) => {
        const category = new URL(request.url).searchParams.get('category');

        if (category === 'MEAT_EGG') {
          await categoryRequest;

          return HttpResponse.json({
            code: 'SUCCESS',
            data: {
              availableCategories:
                PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE.data.availableCategories,
              content: categoryProducts.MEAT_EGG,
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

    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(await eventSection.findByText('대추방울토마토 500G')).toBeInTheDocument();

    const productContentRegion = eventSection.getByRole('region', {
      name: '행사 할인 상품 목록',
    });

    vi.spyOn(productContentRegion, 'getBoundingClientRect').mockReturnValue({
      bottom: 680,
      height: 480,
      left: 0,
      right: 300,
      toJSON: () => ({}),
      top: 200,
      width: 300,
      x: 0,
      y: 200,
    });

    await user.click(eventSection.getByRole('button', { name: '정육·달걀' }));

    expect(await eventSection.findByRole('status')).toHaveTextContent(
      '행사 상품을 불러오는 중이에요.',
    );
    expect(productContentRegion).toHaveStyle({ minHeight: '480px' });
    expect(productContentRegion).toHaveAttribute('aria-busy', 'true');

    act(() => {
      releaseCategoryRequest?.();
    });

    expect(await eventSection.findByText('삼겹살 500G')).toBeInTheDocument();
    await waitFor(() => {
      expect(productContentRegion.style.minHeight).toBe('');
      expect(productContentRegion).toHaveAttribute('aria-busy', 'false');
    });
  });

  it('행사 상품을 클릭하면 category와 상품 상대 위치를 저장한다', async () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1_240);
    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');
    const productLink = await eventSection.findByRole('link', {
      name: '대추방울토마토 500G 상품 보기',
    });

    vi.spyOn(productLink, 'getBoundingClientRect').mockReturnValue({
      bottom: 300,
      height: 100,
      left: 0,
      right: 100,
      toJSON: () => ({}),
      top: 200,
      width: 100,
      x: 0,
      y: 200,
    });
    productLink.addEventListener('click', (event) => event.preventDefault(), { once: true });

    fireEvent.click(productLink);
    expect(consumePendingMarketProductsScrollRestoration(MARKET_SLUG)).toMatchObject({
      anchorId: getMarketProductAnchorId('event-discount', 302),
      isCategoryExpanded: false,
      productId: '302',
      scrollY: 1_240,
      section: 'event-discount',
      selectedCategoryId: 'all',
      viewportTop: 200,
    });
  });

  it('목록이 마운트된 뒤 복원 상태가 도착해도 저장한 category를 적용한다', async () => {
    useTimerAnimationFrame();
    vi.stubGlobal('scrollBy', vi.fn());
    await renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(eventSection.getByRole('button', { name: '전체' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    saveMarketProductsScrollRestoration({
      anchorId: getMarketProductAnchorId('event-discount', 402),
      isCategoryExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: '402',
      scrollY: 1_240,
      section: 'event-discount',
      selectedCategoryId: 'meat-egg',
      viewportTop: 0,
    });

    const marketListHistoryState = window.history.state;

    window.history.replaceState({}, '', `/markets/${MARKET_SLUG}/products/402`);

    act(() => {
      window.history.replaceState(marketListHistoryState, '', `/markets/${MARKET_SLUG}`);
      window.dispatchEvent(
        new PopStateEvent('popstate', {
          state: marketListHistoryState,
        }),
      );
    });

    await waitFor(() => {
      expect(eventSection.getByRole('button', { name: '정육·달걀' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
    expect(document.getElementById(getMarketProductAnchorId('event-discount', 402))).not.toBeNull();
  });

  it('행사 상품 상세에서 뒤로오면 category와 기존 무한 목록 pages를 재사용한다', async () => {
    const marketId = MARKET_DETAIL_API_RESPONSE_FIXTURE.data.marketId;
    const cachedLastProduct = {
      discountedPrice: 8_900,
      name: '캐시된 5페이지 행사 상품',
      productId: 499,
      thumbnailUrl: null,
    };
    const cachedPages = [
      {
        ...PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE.data,
        content: categoryProducts.MEAT_EGG,
        nextCursor: 402,
      },
      {
        ...PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE.data,
        content: [cachedLastProduct],
      },
    ];
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Number.POSITIVE_INFINITY,
        },
      },
    });
    let periodicRequestCount = 0;

    queryClient.setQueryData(marketQueryKeys.periodicProducts({ category: 'MEAT_EGG', marketId }), {
      pageParams: [undefined, 402],
      pages: cachedPages,
    });
    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, () => {
        periodicRequestCount += 1;
        return HttpResponse.json(PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE);
      }),
    );
    useTimerAnimationFrame();
    saveMarketProductsScrollRestoration({
      anchorId: getMarketProductAnchorId('event-discount', cachedLastProduct.productId),
      isCategoryExpanded: true,
      marketSlug: MARKET_SLUG,
      productId: String(cachedLastProduct.productId),
      scrollY: 1_640,
      section: 'event-discount',
      selectedCategoryId: 'meat-egg',
      viewportTop: 0,
    });
    renderWithProviders(<MarketProductsPage marketSlug={MARKET_SLUG} />, { queryClient });

    await screen.findByRole('heading', { name: MARKET_DETAIL_API_RESPONSE_FIXTURE.data.name });

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(await eventSection.findByText(cachedLastProduct.name)).toBeInTheDocument();
    expect(eventSection.getByRole('button', { name: '정육·달걀' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(eventSection.getByRole('button', { name: '더보기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(periodicRequestCount).toBe(0);
    expect(
      queryClient.getQueryData(
        marketQueryKeys.periodicProducts({ category: 'MEAT_EGG', marketId }),
      ),
    ).toMatchObject({
      pageParams: [undefined, 402],
      pages: [{ content: categoryProducts.MEAT_EGG }, { content: [cachedLastProduct] }],
    });
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

  it('선택한 카테고리의 상품이 없어져도 현재 필터 칩은 유지한다', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, ({ request }) => {
        const category = new URL(request.url).searchParams.get('category');

        if (category === 'MEAT_EGG') {
          return HttpResponse.json({
            code: 'SUCCESS',
            data: { availableCategories: [], content: [], hasNext: false, nextCursor: null },
            message: '요청에 성공했습니다.',
            success: true,
          });
        }

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
    await user.click(await eventSection.findByRole('button', { name: '정육·달걀' }));

    expect(
      await eventSection.findByText('해당 카테고리에 등록된 상품이 없어요.'),
    ).toBeInTheDocument();
    expect(eventSection.getByRole('button', { name: '정육·달걀' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(eventSection.getByRole('button', { name: '전체' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    await user.click(eventSection.getByRole('button', { name: '전체' }));

    expect(eventSection.getByRole('button', { name: '전체' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
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

  it('빈 중간 페이지의 다음 요청이 실패하면 다음 페이지 오류만 표시한다', async () => {
    server.use(
      http.get(PERIODIC_PRODUCTS_API_PATH, ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');

        if (cursor != null) {
          return HttpResponse.json({ message: 'Bad request' }, { status: 400 });
        }

        return HttpResponse.json({
          code: 'SUCCESS',
          data: {
            availableCategories: [],
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

    const eventSection = getSectionQueries('행사 할인 상품');

    expect(await eventSection.findByText('행사 상품을 더 찾고 있어요.')).toBeInTheDocument();

    act(() => {
      intersectionObserverCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(await eventSection.findByRole('alert')).toHaveTextContent(
      '상품을 더 불러오지 못했어요.',
    );
    expect(eventSection.getAllByRole('alert')).toHaveLength(1);
    expect(eventSection.getAllByRole('button', { name: '다시 시도' })).toHaveLength(1);
    expect(eventSection.queryByText('행사 상품을 불러오지 못했어요.')).not.toBeInTheDocument();
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

describe('getShareUrl', () => {
  it('운영 client origin과 인코딩된 마트 route를 조합한다', () => {
    expect(getShareUrl('망원 fresh')).toBe(
      'https://app.dongchiimi.com/markets/%EB%A7%9D%EC%9B%90%20fresh',
    );
  });
});
