import { RouterProvider, createMemoryRouter } from 'react-router';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loginMarketOwner, signupMarketOwner } from '@/domains/auth/api/auth-api';
import { getProductSearch } from '@/domains/product/api/get-product-search';
import { ApiError } from '@/shared/api';
import { render, screen } from '@/test';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';
import { AppProviders } from './AppProviders';
import { marketOwnerRoutes } from './router';

vi.mock('@/domains/auth/api/auth-api', () => ({
  loginMarketOwner: vi.fn(),
  signupMarketOwner: vi.fn(),
}));
vi.mock('@/domains/product/api/get-product-search', () => ({
  getProductSearch: vi.fn(),
}));

vi.mock('@/domains/product/hooks/use-product-list-query', () => ({
  useProductListQuery: ({ type }: { type: 'DAILY' | 'PERIODIC' }) => ({
    data: {
      data: {
        content:
          type === 'DAILY'
            ? [
                {
                  category: 'VEGETABLE_FRUIT',
                  categoryName: '채소/과일',
                  createdAt: '2026-08-15T10:00:00',
                  discountedPrice: 4500,
                  discountEndDate: '2026-08-16',
                  discountStartDate: '2026-08-15',
                  name: '풀무원 콩나물 100g',
                  originalPrice: 5000,
                  productId: 124,
                  promotionalPhrase: null,
                  thumbnailUrl: null,
                  viewCount: 91,
                },
              ]
            : [
                {
                  category: 'VEGETABLE_FRUIT',
                  categoryName: '채소/과일',
                  createdAt: '2026-08-15T10:00:00',
                  discountedPrice: 3900,
                  discountEndDate: '2026-08-16',
                  discountStartDate: '2026-08-12',
                  name: '햇감자 1kg',
                  originalPrice: 4500,
                  productId: 201,
                  promotionalPhrase: null,
                  thumbnailUrl: null,
                  viewCount: 241,
                },
              ],
        hasNext: false,
      },
    },
    isPending: false,
  }),
}));

vi.mock('@/domains/product/hooks/use-product-detail-query', () => ({
  useProductDetailQuery: ({ productId }: { productId: number }) => {
    const isDaily = productId === 124;

    return {
      data: {
        data: {
          productId,
          name: isDaily ? '풀무원 콩나물 100g' : '햇감자 1kg',
          dealType: isDaily ? 'DAILY' : 'PERIODIC',
          thumbnailUrl: null,
          originalPrice: isDaily ? 5000 : 4500,
          discountedPrice: isDaily ? 4500 : 3900,
          category: 'VEGETABLE_FRUIT',
          categoryName: '채소/과일',
          promotionalPhrase: null,
          discountStartDate: isDaily ? '2026-08-15' : '2026-08-12',
          discountEndDate: '2026-08-16',
        },
      },
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    };
  },
}));

const mockLoginMarketOwner = vi.mocked(loginMarketOwner);
const mockSignupMarketOwner = vi.mocked(signupMarketOwner);
const mockGetProductSearch = vi.mocked(getProductSearch);

const productSearchItems = [
  {
    dealType: 'DAILY',
    name: '딸기 2팩',
    productId: 101,
  },
  {
    dealType: 'DAILY',
    name: '풀무원 콩나물 100g',
    productId: 124,
  },
  {
    dealType: 'PERIODIC',
    name: '햇감자 1kg',
    productId: 201,
  },
] as const;

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.getState().clearSession();
  localStorage.clear();
  mockLoginMarketOwner.mockResolvedValue({
    success: true,
    code: 'SUCCESS',
    message: 'ok',
    data: {
      accessToken: 'access-token',
      ownerId: 1,
      email: 'owner@example.com',
    },
  });
  mockSignupMarketOwner.mockResolvedValue({
    success: true,
    code: 'SUCCESS',
    message: 'ok',
    data: {
      accessToken: 'signup-access-token',
      ownerId: 1,
      email: 'new@example.com',
      marketId: null,
      marketName: null,
      marketThumbnailUrl: null,
    },
  });
  mockGetProductSearch.mockImplementation(({ keyword }) =>
    Promise.resolve({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: {
        products: productSearchItems.filter(({ name }) => name.includes(keyword)),
      },
    }),
  );
});

const isPublicAuthRoute = (path: string) => {
  return path === MARKET_OWNER_ROUTES.login || path === MARKET_OWNER_ROUTES.signup;
};

const renderRoute = (path: string, { authenticated = !isPublicAuthRoute(path) } = {}) => {
  if (authenticated) {
    useAuthStore.getState().setAccessToken('access-token');
  } else {
    useAuthStore.getState().clearSession();
  }

  const router = createMemoryRouter(marketOwnerRoutes, {
    initialEntries: [path],
  });
  const renderResult = render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );

  return {
    router,
    ...renderResult,
  };
};

const ROUTE_RENDER_TIMEOUT_MS = 5_000;

const findRouteHeading = (name: string) => {
  return screen.findByRole('heading', { name }, { timeout: ROUTE_RENDER_TIMEOUT_MS });
};

const fillSignupForm = async (
  user: ReturnType<typeof userEvent.setup>,
  {
    email,
    password,
    passwordConfirm,
  }: { email: string; password: string; passwordConfirm: string },
) => {
  await user.type(await screen.findByLabelText('이메일'), email);
  await user.type(screen.getByLabelText('비밀번호'), password);
  await user.type(screen.getByLabelText('비밀번호 확인'), passwordConfirm);
};

const mockClipboardWriteText = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText,
    },
  });
};

const expectSidebarToastViewportToUseViewportTopCenter = () => {
  const toastViewport = screen.getByRole('region', { name: '토스트 알림' });

  expect(toastViewport.style.getPropertyValue('--toast-viewport-center-offset-x')).toBe('');
  expect(toastViewport).toHaveStyle({
    '--toast-viewport-offset-x': '2rem',
    '--toast-viewport-offset-y': '2rem',
  });
};

const expectAuthToastViewportToUseViewportTopCenter = () => {
  const toastViewport = screen.getByRole('region', { name: '토스트 알림' });

  expect(toastViewport.style.getPropertyValue('--toast-viewport-center-offset-x')).toBe('');
  expect(toastViewport).toHaveStyle({
    '--toast-viewport-offset-x': '2.4rem',
    '--toast-viewport-offset-y': '2.4rem',
  });
};

describe('marketOwnerRoutes', () => {
  it('renders public auth routes without the sidebar layout', async () => {
    renderRoute('/login');

    expect(await screen.findByRole('heading', { name: '마트 관리자 로그인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('redirects authenticated users away from the login route', async () => {
    const { router } = renderRoute('/login', { authenticated: true });

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.home);
    });
  });

  it('centers login toasts over the viewport through the auth layout toast policy', async () => {
    const user = userEvent.setup();

    mockLoginMarketOwner.mockRejectedValueOnce(
      new ApiError({
        message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        type: 'auth',
      }),
    );

    const { container } = renderRoute('/login');

    await screen.findByRole('heading');

    const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
    const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

    expect(emailInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();

    await user.type(emailInput as HTMLInputElement, 'owner@example.com');
    await user.type(passwordInput as HTMLInputElement, 'password123!');
    await user.click(screen.getByRole('button'));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expectAuthToastViewportToUseViewportTopCenter();
  });

  it('redirects unauthenticated protected route access to login and returns after login', async () => {
    const user = userEvent.setup();
    const { container, router } = renderRoute('/products/today-special/edit?productId=124', {
      authenticated: false,
    });

    await screen.findByRole('heading');
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.login);
    expect(router.state.location.state).toEqual({
      from: '/products/today-special/edit?productId=124',
    });

    const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
    const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

    expect(emailInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();

    await user.type(emailInput as HTMLInputElement, 'owner@example.com');
    await user.type(passwordInput as HTMLInputElement, 'password123!');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.todaySpecialEdit);
    });
    expect(router.state.location.search).toBe('?productId=124');
  });

  it('renders the signup form inside the public auth layout', async () => {
    renderRoute('/signup');

    expect(await screen.findByRole('heading', { name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('비밀번호 확인')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: '가입 완료' })).toBeDisabled();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('validates signup email input after focus leaves the field', async () => {
    const user = userEvent.setup();

    renderRoute('/signup');

    const emailInput = await screen.findByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(emailInput, '한글');
    expect(screen.queryByText('올바른 이메일 형식이 아닙니다.')).not.toBeInTheDocument();

    await user.click(passwordInput);
    expect(screen.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();

    await user.clear(emailInput);
    expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();

    await user.clear(emailInput);
    await user.type(emailInput, 'used@example.com');
    expect(screen.queryByText('올바른 이메일 형식이 아닙니다.')).not.toBeInTheDocument();
  });

  it('validates signup password input after focus leaves the field', async () => {
    const user = userEvent.setup();

    renderRoute('/signup');

    const emailInput = await screen.findByLabelText('이메일');
    const passwordInput = await screen.findByLabelText('비밀번호');

    await user.type(passwordInput, 'abc');
    expect(screen.queryByText('6~20자로 입력해주세요.')).not.toBeInTheDocument();

    await user.click(emailInput);
    expect(screen.getByText('6~20자로 입력해주세요.')).toBeInTheDocument();

    await user.clear(passwordInput);
    expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument();

    await user.type(passwordInput, 'abc 1');
    expect(screen.getByText('6~20자로 입력해주세요.')).toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'abc 123');
    expect(screen.getByText('공백은 사용할 수 없습니다.')).toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, '한글1');
    expect(screen.getByText('6~20자로 입력해주세요.')).toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, '한글1234');
    expect(screen.getByText('한글은 사용할 수 없습니다.')).toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'abc123');
    expect(screen.queryByText('6~20자로 입력해주세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('공백은 사용할 수 없습니다.')).not.toBeInTheDocument();
    expect(screen.queryByText('한글은 사용할 수 없습니다.')).not.toBeInTheDocument();
    expect(screen.queryByText('비밀번호를 입력해주세요.')).not.toBeInTheDocument();
  });

  it('validates signup password confirmation after focus leaves the field', async () => {
    const user = userEvent.setup();

    renderRoute('/signup');

    const emailInput = await screen.findByLabelText('이메일');
    const passwordInput = await screen.findByLabelText('비밀번호');
    const passwordConfirmInput = screen.getByLabelText('비밀번호 확인');
    const passwordConfirmInputContainer = passwordConfirmInput.parentElement;

    await user.type(passwordInput, 'abc123');
    await user.type(passwordConfirmInput, 'abc124');
    expect(screen.queryByText('비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();
    expect(passwordConfirmInputContainer?.querySelector('svg')).not.toBeInTheDocument();

    await user.click(emailInput);
    expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();

    await user.clear(passwordConfirmInput);
    expect(screen.getByText('비밀번호를 다시 입력해주세요.')).toBeInTheDocument();

    await user.type(passwordConfirmInput, 'abc123');
    expect(screen.queryByText('비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();
    expect(screen.queryByText('비밀번호를 다시 입력해주세요.')).not.toBeInTheDocument();
    await waitFor(() =>
      expect(passwordConfirmInputContainer?.querySelector('svg')).toBeInTheDocument(),
    );
  });

  it('enables signup submit button when all signup fields are valid', async () => {
    const user = userEvent.setup();

    renderRoute('/signup');

    const submitButton = await screen.findByRole('button', { name: '가입 완료' });

    await fillSignupForm(user, {
      email: 'new@example.com',
      password: 'abc123',
      passwordConfirm: 'abc123',
    });

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('redirects to market information registration page after valid signup submit', async () => {
    const user = userEvent.setup();

    const { router } = renderRoute('/signup');

    await fillSignupForm(user, {
      email: 'new@example.com',
      password: 'abc123',
      passwordConfirm: 'abc123',
    });
    await user.click(await screen.findByRole('button', { name: '가입 완료' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        MARKET_OWNER_ROUTES.marketInformationRegistration,
      );
    });
  });

  it('shows the server duplicate email message when signup API rejects with DUPLICATE_EMAIL', async () => {
    const user = userEvent.setup();

    mockSignupMarketOwner.mockRejectedValueOnce(
      new ApiError({
        code: 'DUPLICATE_EMAIL',
        message: '이미 가입된 이메일입니다.',
        status: 409,
        type: 'validation',
      }),
    );

    renderRoute('/signup');

    await fillSignupForm(user, {
      email: 'used@example.com',
      password: 'abc123',
      passwordConfirm: 'abc123',
    });
    await user.click(await screen.findByRole('button', { name: '가입 완료' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('이미 가입된 이메일입니다.');
    expectAuthToastViewportToUseViewportTopCenter();
    expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument();
  });

  it('renders protected work routes with the sidebar layout', async () => {
    renderRoute('/');

    expect(await screen.findByRole('heading', { name: '동치미 홈' })).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('search', { name: '상품 검색' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /오늘의 특가 상품 등록하기/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /행사 할인 상품 등록하기/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /상품 수정하러 가기/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 할인 상품' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '등록한 상품 전체보기' })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: '전단 공유하기' })).toBeInTheDocument();
    expect(screen.getByText('dongchimi.kr/mangwon-fresh')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '링크 복사' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '매장 고유 QR코드 보기' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '오늘의 전단 공유' })).not.toBeInTheDocument();
  });

  it('navigates the sidebar market information link to the registration page', async () => {
    const user = userEvent.setup();

    renderRoute(MARKET_OWNER_ROUTES.home);

    await screen.findByRole('heading', { name: '동치미 홈' });

    const marketInformationLink = screen.getByRole('link', { name: '마트 정보 관리' });

    expect(marketInformationLink).toHaveAttribute(
      'href',
      MARKET_OWNER_ROUTES.marketInformationRegistration,
    );

    await user.click(marketInformationLink);

    expect(await screen.findByRole('heading', { name: '마트 정보 등록' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('centers sidebar-layout toasts over the viewport', async () => {
    const user = userEvent.setup();

    renderRoute('/products/event-discount/new');

    expect(await findRouteHeading('상품 등록')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '엑셀 양식 다운로드' }));

    expect(await screen.findByRole('status')).toHaveTextContent('엑셀 양식 다운로드 완료');
    expectSidebarToastViewportToUseViewportTopCenter();
  });

  it('navigates the today-special summary action to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '등록한 상품 전체보기' })[0]);

    expect(await findRouteHeading('오늘의 특가 상품을 수정하세요')).toBeInTheDocument();
  });

  it('navigates a today-special product row to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '상품 보기: 풀무원 콩나물 500g' })[0]);

    expect(await findRouteHeading('오늘의 특가 상품을 수정하세요')).toBeInTheDocument();
  });

  it('navigates the event-discount summary action to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '등록한 상품 전체보기' })[1]);

    expect(await findRouteHeading('행사 할인 상품을 수정하세요')).toBeInTheDocument();
  });

  it('navigates an event-discount product row to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '1위 상품 보기: 풀무원 콩나물 500g' }));

    expect(await findRouteHeading('행사 할인 상품을 수정하세요')).toBeInTheDocument();
  });

  it('shows a completed toast when leaflet link copy succeeds', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    mockClipboardWriteText(writeText);
    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '링크 복사' }));

    expect(writeText).toHaveBeenCalledWith('dongchimi.kr/mangwon-fresh');
    expect(await screen.findByRole('status')).toHaveTextContent('전단 링크가 복사되었습니다.');
    expectSidebarToastViewportToUseViewportTopCenter();
  });

  it('shows an error toast when leaflet link copy fails', async () => {
    const user = userEvent.setup();

    mockClipboardWriteText(vi.fn().mockRejectedValue(new Error('copy failed')));
    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '링크 복사' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '링크를 복사하지 못했습니다. 다시 시도해주세요.',
    );
  });

  it('shows a preparing toast when leaflet QR code action is clicked', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '매장 고유 QR코드 보기' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'QR코드 보기 기능은 준비 중입니다.',
    );
  });

  it('navigates a loaded search result to the product edit page', async () => {
    const user = userEvent.setup();

    const { router } = renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '콩나물 100g');
    await user.click(await screen.findByRole('button', { name: /풀무원 콩나물 100g/ }));

    expect(await findRouteHeading('오늘의 특가 상품을 수정하세요')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.todaySpecialEdit);
    expect(router.state.location.search).toBe('?productId=124');
    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('상품명')).toHaveValue('풀무원 콩나물 100g');

    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => expect(router.state.location.search).toBe(''));
    expect(
      screen.queryByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).not.toBeInTheDocument();
  });

  it('navigates an event-discount search result to the product edit modal', async () => {
    const user = userEvent.setup();

    const { router } = renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '햇감자');
    await user.click(await screen.findByRole('button', { name: /햇감자 1kg/ }));

    expect(await findRouteHeading('행사 할인 상품을 수정하세요')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.eventDiscountEdit);
    expect(router.state.location.search).toBe('?productId=201');
    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('상품명')).toHaveValue('햇감자 1kg');

    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => expect(router.state.location.search).toBe(''));
    expect(
      screen.queryByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).not.toBeInTheDocument();
  });

  it('shows pending feedback before debounced search results are applied', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '딸기');

    expect(screen.getByRole('status')).toHaveTextContent('검색 중...');
    expect(screen.queryByText('검색 결과가 없어요. 상품을 등록해보세요.')).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /딸기 2팩/ })).toBeInTheDocument();
  });

  it('shows the search panel error state when the product search API fails', async () => {
    const user = userEvent.setup();
    mockGetProductSearch.mockRejectedValueOnce(
      new ApiError({
        code: 'INVALID_INPUT',
        message: '검색어는 필수입니다.',
        status: 400,
        type: 'validation',
      }),
    );

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '대란 30구');

    expect(await screen.findByRole('alert')).toHaveTextContent('상품 정보를 불러오지 못했어요.');
    expect(screen.getByRole('heading', { name: '동치미 홈' })).toBeInTheDocument();
  });

  it.each([
    ['오늘의 특가 상품 등록하기', '오늘의 특가 상품을 등록하세요'],
    ['행사 할인 상품 등록하기', '상품 등록'],
    ['상품 수정하러 가기', '오늘의 특가 상품을 수정하세요'],
  ])('navigates the %s hero action to its work page', async (buttonName, headingName) => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: new RegExp(buttonName) }));

    expect(await screen.findByRole('heading', { name: headingName })).toBeInTheDocument();
  });

  it('keeps the registration result route outside the sidebar layout', async () => {
    renderRoute('/products/registration-result');

    expect(await findRouteHeading('상품 결과 등록 확인')).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('syncs edit sidebar and tab navigation through route state', async () => {
    renderRoute('/products/event-discount/edit');

    expect(
      await screen.findByRole('heading', { name: '행사 할인 상품을 수정하세요' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인 상품 수정' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('navigation', { name: '상품 수정 유형' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not render the category filter on the today-special edit page', async () => {
    renderRoute('/products/today-special/edit');

    await screen.findByRole('heading', { name: '오늘의 특가 상품을 수정하세요' });

    expect(screen.queryByRole('button', { name: '카테고리별' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '상품 등록 순' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('navigates between product edit pages from the shared header product search', async () => {
    const user = userEvent.setup();

    const { router } = renderRoute(MARKET_OWNER_ROUTES.todaySpecialEdit);

    await screen.findByRole('heading', { name: '오늘의 특가 상품을 수정하세요' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '햇감자');
    await user.click(await screen.findByRole('button', { name: /햇감자 1kg/ }));

    expect(await findRouteHeading('행사 할인 상품을 수정하세요')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.eventDiscountEdit);
    expect(router.state.location.search).toBe('?productId=201');
    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('상품명')).toHaveValue('햇감자 1kg');

    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => expect(router.state.location.search).toBe(''));
    expect(
      screen.queryByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).not.toBeInTheDocument();
  });

  it('keeps the current edit page when the shared header search API fails', async () => {
    const user = userEvent.setup();
    mockGetProductSearch.mockRejectedValueOnce(
      new ApiError({
        code: 'INVALID_INPUT',
        message: '검색어는 필수입니다.',
        status: 400,
        type: 'validation',
      }),
    );

    const { router } = renderRoute(MARKET_OWNER_ROUTES.eventDiscountEdit);

    await screen.findByRole('heading', { name: '행사 할인 상품을 수정하세요' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '대란 30구');

    expect(await screen.findByRole('alert')).toHaveTextContent('상품 정보를 불러오지 못했어요.');
    expect(
      screen.getByRole('heading', { name: '행사 할인 상품을 수정하세요' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.eventDiscountEdit);
    expect(router.state.location.search).toBe('');
  });

  it('keeps the period bulk edit action enabled on the edit page', async () => {
    renderRoute('/products/today-special/edit');

    expect(
      await screen.findByRole('heading', { name: '오늘의 특가 상품을 수정하세요' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '기간 일괄 수정' })).toBeEnabled();
  });

  it('keeps the bulk delete action enabled on the edit page', async () => {
    renderRoute('/products/event-discount/edit');

    expect(
      await screen.findByRole('heading', { name: '행사 할인 상품을 수정하세요' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '일괄 삭제' })).toBeEnabled();
  });

  it('renders the not found page for unknown routes', async () => {
    renderRoute('/unknown-route');

    expect(
      await screen.findByRole('heading', { name: '페이지를 찾을 수 없습니다.' }),
    ).toBeInTheDocument();
  });
});
