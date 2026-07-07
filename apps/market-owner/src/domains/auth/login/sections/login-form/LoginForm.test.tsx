import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../../../test';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders reusable form controls for market owner login', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '로그인 상태 유지' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
  });

  it('toggles the design-system checkbox control for keeping the user signed in', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const keepSignedInCheckbox = screen.getByRole('checkbox', { name: '로그인 상태 유지' });

    expect(keepSignedInCheckbox).not.toBeChecked();

    await user.click(keepSignedInCheckbox);

    expect(keepSignedInCheckbox).toBeChecked();
  });

  it('validates the required email field while the user edits it', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('이메일');

    await user.type(emailInput, 'invalid-email');

    expect(emailInput).toHaveValue('invalid-email');
    expect(screen.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();
    expect(emailInput).toBeInvalid();

    await user.clear(emailInput);

    expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();
    expect(emailInput).toBeInvalid();
  });

  it('accepts only email-safe characters and clears the error for a valid email', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('이메일');

    await user.type(emailInput, 'owner_01-test@example.co.kr');

    expect(emailInput).toHaveValue('owner_01-test@example.co.kr');
    expect(screen.queryByText('올바른 이메일 형식이 아닙니다.')).not.toBeInTheDocument();
    expect(emailInput).toBeValid();

    await user.type(emailInput, '한글!');

    expect(emailInput).toHaveValue('owner_01-test@example.co.kr');
  });
});
