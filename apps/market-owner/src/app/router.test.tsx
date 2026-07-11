import { RouterProvider, createMemoryRouter } from 'react-router';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test';
import { AppProviders } from './AppProviders';
import { marketOwnerRoutes } from './router';

const renderRoute = (path: string) => {
  const router = createMemoryRouter(marketOwnerRoutes, {
    initialEntries: [path],
  });

  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
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

describe('marketOwnerRoutes', () => {
  it('renders public auth routes without the sidebar layout', async () => {
    renderRoute('/login');

    expect(await screen.findByRole('heading', { name: '마트 관리자 로그인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
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

  it('validates signup email input in real time', async () => {
    const user = userEvent.setup();

    renderRoute('/signup');

    const emailInput = await screen.findByLabelText('이메일');

    await user.type(emailInput, '한글');
    expect(screen.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();

    await user.clear(emailInput);
    expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();

    await user.type(emailInput, 'used@example.com');
    expect(screen.getByText('이미 사용 중인 이메일입니다.')).toBeInTheDocument();

    await user.clear(emailInput);
    await user.type(emailInput, 'new@example.com');
    expect(screen.queryByText('올바른 이메일 형식이 아닙니다.')).not.toBeInTheDocument();
    expect(screen.queryByText('이미 사용 중인 이메일입니다.')).not.toBeInTheDocument();
  });

  it('validates signup password input in real time', async () => {
    const user = userEvent.setup();

    renderRoute('/signup');

    const passwordInput = await screen.findByLabelText('비밀번호');

    await user.type(passwordInput, 'abc');
    expect(screen.getByText('6-20자로 입력해주세요.')).toBeInTheDocument();

    await user.clear(passwordInput);
    expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument();

    await user.type(passwordInput, 'abc 123');
    expect(screen.getByText('6-20자로 입력해주세요.')).toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, '한글1234');
    expect(screen.getByText('6-20자로 입력해주세요.')).toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'abc123');
    expect(screen.queryByText('6-20자로 입력해주세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('비밀번호를 입력해주세요.')).not.toBeInTheDocument();
  });

  it('validates signup password confirmation in real time', async () => {
    const user = userEvent.setup();

    renderRoute('/signup');

    const passwordInput = await screen.findByLabelText('비밀번호');
    const passwordConfirmInput = screen.getByLabelText('비밀번호 확인');
    const passwordConfirmInputContainer = passwordConfirmInput.parentElement;

    await user.type(passwordInput, 'abc123');
    await user.type(passwordConfirmInput, 'abc124');
    expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
    expect(passwordConfirmInputContainer?.querySelector('svg')).not.toBeInTheDocument();

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

  it('redirects to login page after valid signup submit', async () => {
    const user = userEvent.setup();

    renderRoute('/signup');

    await fillSignupForm(user, {
      email: 'new@example.com',
      password: 'abc123',
      passwordConfirm: 'abc123',
    });
    await user.click(await screen.findByRole('button', { name: '가입 완료' }));

    expect(await screen.findByRole('heading', { name: '마트 관리자 로그인' })).toBeInTheDocument();
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

  it('centers sidebar-layout toasts over the viewport', async () => {
    const user = userEvent.setup();

    renderRoute('/products/event-discount/new');

    expect(await screen.findByRole('heading', { name: '상품 등록' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '엑셀 양식 다운로드' }));

    expect(await screen.findByRole('status')).toHaveTextContent('엑셀 양식 다운로드 완료');
    expectSidebarToastViewportToUseViewportTopCenter();
  });

  it('navigates the today-special summary action to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '등록한 상품 전체보기' })[0]);

    expect(
      await screen.findByRole('heading', { name: '오늘의 특가 상품을 수정하세요' }),
    ).toBeInTheDocument();
  });

  it('navigates a today-special product row to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '상품 보기: 풀무원 콩나물 500g' })[0]);

    expect(
      await screen.findByRole('heading', { name: '오늘의 특가 상품을 수정하세요' }),
    ).toBeInTheDocument();
  });

  it('navigates the event-discount summary action to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '등록한 상품 전체보기' })[1]);

    expect(
      await screen.findByRole('heading', { name: '행사 할인 상품을 수정하세요' }),
    ).toBeInTheDocument();
  });

  it('navigates an event-discount product row to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '1위 상품 보기: 풀무원 콩나물 500g' }));

    expect(
      await screen.findByRole('heading', { name: '행사 할인 상품을 수정하세요' }),
    ).toBeInTheDocument();
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

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '콩나물 100g');
    await user.click(await screen.findByRole('button', { name: /풀무원 콩나물 100g/ }));

    expect(
      await screen.findByRole('heading', { name: '오늘의 특가 상품을 수정하세요' }),
    ).toBeInTheDocument();
  });

  it('shows pending feedback before debounced search results are applied', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '풀');

    expect(screen.getByRole('status')).toHaveTextContent('검색 중...');
    expect(screen.queryByText('검색 결과가 없어요. 상품을 등록해보세요.')).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /풀무원 두부 1팩/ })).toBeInTheDocument();
  });

  it('shows an error toast when selected search product info cannot be loaded', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '두부 1팩');
    await user.click(await screen.findByRole('button', { name: /풀무원 두부 1팩/ }));

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

    expect(await screen.findByRole('heading', { name: '상품 결과 등록 확인' })).toBeInTheDocument();
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

  it('opens period bulk edit modal after selecting products on the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/products/today-special/edit');

    expect(
      await screen.findByRole('heading', { name: '오늘의 특가 상품을 수정하세요' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '기간 일괄 수정' }));

    expect(screen.getByText('선택된 상품 (0)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '딸기 2팩 상품 수정' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '딸기 2팩 상품 삭제' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '딸기 2팩 상품 선택' }));

    expect(screen.getByText('선택된 상품 (1)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '기간 일괄 수정' }));

    expect(
      await screen.findByRole('dialog', { name: '선택된 상품들의 판매 기간을 수정해주세요' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('행사 종료일')).toHaveValue('2026-08-16');

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.queryByText('선택된 상품 (1)')).not.toBeInTheDocument();
  });

  it('deletes selected products from the edit page bulk delete flow', async () => {
    const user = userEvent.setup();

    renderRoute('/products/event-discount/edit');

    expect(
      await screen.findByRole('heading', { name: '행사 할인 상품을 수정하세요' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '일괄 삭제' }));

    expect(screen.getByText('선택된 상품 (0)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '햇감자 1kg 상품 선택' }));

    expect(screen.getByText('선택된 상품 (1)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '일괄 삭제' }));

    expect(
      await screen.findByRole('dialog', {
        name: /행사 기간이 아직 남았어요\.\s*정말 삭제하시겠어요\?/,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '삭제하기' }));

    expect(screen.queryByText('햇감자 1kg')).not.toBeInTheDocument();
    expect(screen.queryByText('선택된 상품 (1)')).not.toBeInTheDocument();
  });

  it('renders the not found page for unknown routes', async () => {
    renderRoute('/unknown-route');

    expect(
      await screen.findByRole('heading', { name: '페이지를 찾을 수 없습니다.' }),
    ).toBeInTheDocument();
  });
});
