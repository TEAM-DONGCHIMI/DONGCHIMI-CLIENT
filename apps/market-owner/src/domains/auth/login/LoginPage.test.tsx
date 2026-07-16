import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ToastProvider } from '@dongchimi/shared/toast';

import { QueryProvider } from '@/shared/query';
import { render, screen } from '@/test';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('renders the shared 92 by 32 brand logo', () => {
    const { container } = render(
      <MemoryRouter>
        <QueryProvider>
          <ToastProvider>
            <LoginPage />
          </ToastProvider>
        </QueryProvider>
      </MemoryRouter>,
    );
    const logo = container.querySelector('img');

    expect(screen.getByRole('heading', { name: '마트 관리자 로그인' })).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('Img_pavicon.svg'));
    expect(logo).toHaveAttribute('width', '92');
    expect(logo).toHaveAttribute('height', '32');
  });
});
