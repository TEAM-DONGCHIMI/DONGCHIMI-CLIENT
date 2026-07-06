import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../../../test';
import { LoginCardLayout } from './LoginCardLayout';

describe('LoginCardLayout', () => {
  it('renders the title area and caller-owned content inside the card shell', () => {
    render(
      <LoginCardLayout>
        <span>Login form slot</span>
      </LoginCardLayout>,
    );

    expect(screen.getByRole('region', { name: '마트 관리자 로그인' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '마트 관리자 로그인' })).toBeInTheDocument();
    expect(screen.getByText('Login form slot')).toBeInTheDocument();
  });
});
