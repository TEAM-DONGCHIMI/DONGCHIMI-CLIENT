import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../../../test';
import { SignupPrompt } from './SignupPrompt';

describe('SignupPrompt', () => {
  it('renders a prompt and a link that routes to the signup page', () => {
    render(
      <MemoryRouter>
        <SignupPrompt />
      </MemoryRouter>,
    );

    expect(screen.getByText('아직 회원이 아니신가요?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup');
  });
});
