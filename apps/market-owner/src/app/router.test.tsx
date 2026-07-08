import { RouterProvider, createMemoryRouter } from 'react-router';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../test';
import { marketOwnerRoutes } from './router';

const renderRoute = (path: string) => {
  const router = createMemoryRouter(marketOwnerRoutes, {
    initialEntries: [path],
  });

  return render(<RouterProvider router={router} />);
};

describe('marketOwnerRoutes', () => {
  it('renders public auth routes without the sidebar layout', async () => {
    renderRoute('/login');

    expect(await screen.findByRole('heading', { name: '로그인' })).toBeInTheDocument();
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

    await user.type(passwordInput, 'abc123');
    await user.type(passwordConfirmInput, 'abc124');
    expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();

    await user.clear(passwordConfirmInput);
    expect(screen.getByText('비밀번호를 다시 입력해주세요.')).toBeInTheDocument();

    await user.type(passwordConfirmInput, 'abc123');
    expect(screen.queryByText('비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();
    expect(screen.queryByText('비밀번호를 다시 입력해주세요.')).not.toBeInTheDocument();
  });

  it('enables signup submit button when all signup fields are valid', async () => {
    const user = userEvent.setup();

    const { container } = renderRoute('/signup');

    const submitButton = await screen.findByRole('button', { name: '가입 완료' });
    const emailInput = container.querySelector<HTMLInputElement>('input[name="email"]');
    const passwordInput = container.querySelector<HTMLInputElement>('input[name="password"]');
    const passwordConfirmInput = container.querySelector<HTMLInputElement>(
      'input[name="passwordConfirm"]',
    );

    if (emailInput === null || passwordInput === null || passwordConfirmInput === null) {
      throw new Error('Expected signup inputs to be rendered.');
    }

    await user.type(emailInput, 'new@example.com');
    await user.type(passwordInput, 'abc123');
    await user.type(passwordConfirmInput, 'abc123');

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('renders protected work routes with the sidebar layout', async () => {
    renderRoute('/');

    expect(await screen.findByRole('heading', { name: '홈' })).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: '오늘의 전단 공유' })).not.toBeInTheDocument();
  });

  it('keeps the registration result route outside the sidebar layout', async () => {
    renderRoute('/products/registration-result');

    expect(await screen.findByRole('heading', { name: '상품 등록 결과 확인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('syncs edit sidebar and tab navigation through route state', async () => {
    renderRoute('/products/event-discount/edit');

    expect(await screen.findByRole('heading', { name: '행사 할인 상품 수정' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인 상품 수정' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('navigation', { name: '상품 수정 유형' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders the not found page for unknown routes', async () => {
    renderRoute('/unknown-route');

    expect(
      await screen.findByRole('heading', { name: '페이지를 찾을 수 없습니다.' }),
    ).toBeInTheDocument();
  });
});
