import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { AppProviders } from '@/app/AppProviders';
import { render, screen, userEvent } from '@/test';

import { TodaySpecialRegistrationPage } from './TodaySpecialRegistrationPage';

const renderTodaySpecialRegistrationPage = () => {
  return render(
    <MemoryRouter>
      <AppProviders>
        <TodaySpecialRegistrationPage />
      </AppProviders>
    </MemoryRouter>,
  );
};

describe('TodaySpecialRegistrationPage', () => {
  it('selects a category from the OverlayKit dropdown', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소·과일'));

    expect(screen.getByRole('button', { name: '채소·과일' })).toBeInTheDocument();
  });
});
