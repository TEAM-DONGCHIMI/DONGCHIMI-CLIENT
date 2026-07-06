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
});
