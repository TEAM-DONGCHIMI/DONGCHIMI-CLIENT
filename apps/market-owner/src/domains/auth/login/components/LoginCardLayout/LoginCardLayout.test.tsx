import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../../../test';
import { LoginCardLayout } from './LoginCardLayout';

describe('LoginCardLayout', () => {
  it('renders caller-owned content inside the card shell', () => {
    render(
      <LoginCardLayout aria-label='Login card'>
        <span>Login form slot</span>
      </LoginCardLayout>,
    );

    expect(screen.getByRole('region', { name: 'Login card' })).toBeInTheDocument();
    expect(screen.getByText('Login form slot')).toBeInTheDocument();
  });
});
