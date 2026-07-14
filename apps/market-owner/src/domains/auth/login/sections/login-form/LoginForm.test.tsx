import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { QueryProvider } from '@/shared/query';
import { ApiError } from '@/shared/api';

import { render, screen, waitFor } from '../../../../../test';
import { LoginForm, type LoginFormProps } from './LoginForm';

const renderLoginForm = (props: LoginFormProps = {}) => {
  return render(
    <MemoryRouter>
      <QueryProvider>
        <LoginForm {...props} />
      </QueryProvider>
    </MemoryRouter>,
  );
};

describe('LoginForm', () => {
  it('renders reusable form controls for market owner login', () => {
    renderLoginForm();

    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '로그인 상태 유지' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
  });

  it('keeps the user on a normal login by default', () => {
    renderLoginForm();

    expect(screen.getByRole('checkbox', { name: '로그인 상태 유지' })).not.toBeChecked();
  });

  it('toggles the design-system checkbox control for keeping the user signed in', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const keepSignedInCheckbox = screen.getByRole('checkbox', { name: '로그인 상태 유지' });

    expect(keepSignedInCheckbox).not.toBeChecked();

    await user.click(keepSignedInCheckbox);

    expect(keepSignedInCheckbox).toBeChecked();

    await user.click(keepSignedInCheckbox);

    expect(keepSignedInCheckbox).not.toBeChecked();
  });

  it('shows the email field error after focus leaves the field', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(emailInput, 'invalid-email');

    expect(emailInput).toHaveValue('invalid-email');
    expect(screen.queryByText('올바른 이메일 형식이 아닙니다.')).not.toBeInTheDocument();
    expect(emailInput).not.toHaveAttribute('aria-invalid');

    await user.click(passwordInput);

    expect(screen.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();
    expect(emailInput).toBeInvalid();

    await user.clear(emailInput);

    expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();
    expect(emailInput).toBeInvalid();
  });

  it('allows Korean email input and keeps the email format validation', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(emailInput, 'owner_01-test@example.co.kr');

    expect(emailInput).toHaveValue('owner_01-test@example.co.kr');
    expect(screen.queryByText('올바른 이메일 형식이 아닙니다.')).not.toBeInTheDocument();
    expect(emailInput).toBeValid();

    await user.type(emailInput, '한글!');

    expect(emailInput).toHaveValue('owner_01-test@example.co.kr한글!');

    await user.click(passwordInput);

    expect(screen.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();
    expect(emailInput).toBeInvalid();
  });

  it('shows the password field error after focus leaves the field', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.type(passwordInput, 'secret');

    expect(passwordInput).toHaveValue('secret');
    expect(screen.queryByText('비밀번호를 입력해주세요.')).not.toBeInTheDocument();
    expect(passwordInput).toBeValid();

    await user.clear(passwordInput);

    expect(screen.queryByText('비밀번호를 입력해주세요.')).not.toBeInTheDocument();

    await user.click(emailInput);

    expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument();
    expect(passwordInput).toBeInvalid();
  });

  it('enables the login button only after email and password pass validation', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const loginButton = screen.getByRole('button', { name: '로그인' });

    await user.type(screen.getByLabelText('이메일'), 'owner@example.com');

    expect(loginButton).toBeDisabled();

    await user.type(screen.getByLabelText('비밀번호'), 'secret');

    expect(loginButton).toBeEnabled();
  });

  it('submits login once and disables the button while the request is pending', async () => {
    const user = userEvent.setup();
    const submitLogin = vi.fn(() => new Promise<{ redirectTo: '/' }>(() => undefined));

    renderLoginForm({ submitLogin });

    await user.type(screen.getByLabelText('이메일'), 'owner@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'secret');

    const loginButton = screen.getByRole('button', { name: '로그인' });

    await user.click(loginButton);

    expect(submitLogin).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });

    await user.click(loginButton);

    expect(submitLogin).toHaveBeenCalledOnce();
  });

  it('shows a toast and keeps the form visible when auth login fails', async () => {
    const user = userEvent.setup();
    const submitLogin = vi.fn().mockRejectedValue({ type: 'auth' });

    renderLoginForm({ submitLogin });

    await user.type(screen.getByLabelText('이메일'), 'owner@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'secret');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이메일 또는 비밀번호가 일치하지 않습니다.',
    );
    expect(screen.getByRole('form', { name: '마트 관리자 로그인' })).toBeInTheDocument();
  });

  it('shows a network toast when the login request fails by network error', async () => {
    const user = userEvent.setup();
    const submitLogin = vi.fn().mockRejectedValue({ type: 'network' });

    renderLoginForm({ submitLogin });

    await user.type(screen.getByLabelText('이메일'), 'owner@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'secret');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '네트워크 연결을 확인한 후 다시 시도해주세요.',
    );
  });

  it('shows the API error message when login fails outside auth mismatch', async () => {
    const user = userEvent.setup();
    const submitLogin = vi.fn().mockRejectedValue(
      new ApiError({
        message: '서버 오류가 발생했습니다.',
        type: 'server',
      }),
    );

    renderLoginForm({ submitLogin });

    await user.type(screen.getByLabelText('이메일'), 'owner@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'secret');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('서버 오류가 발생했습니다.');
  });
});
