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
  it('keeps submit disabled while required fields are empty', () => {
    renderTodaySpecialRegistrationPage();

    expect(screen.getByRole('button', { name: '등록 완료' })).toBeDisabled();
  });

  it('selects a category from the OverlayKit dropdown', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소·과일'));

    expect(screen.getByRole('button', { name: '채소·과일' })).toBeInTheDocument();
  });

  it('moves between product drafts without losing field values', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '첫번째 상품');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(
      screen.getByRole('heading', { name: /오늘의 특가 상품을 등록하세요/ }),
    ).toHaveTextContent('(2/2)');

    await user.type(screen.getByLabelText('상품명'), '두번째 상품');
    await user.click(screen.getByRole('button', { name: '이전 상품' }));

    expect(screen.getByLabelText('상품명')).toHaveValue('첫번째 상품');

    await user.click(screen.getByRole('button', { name: '다음 상품' }));

    expect(screen.getByLabelText('상품명')).toHaveValue('두번째 상품');
  });

  it('removes current product draft and keeps the remaining draft selected', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '남는 상품');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));
    await user.type(screen.getByLabelText('상품명'), '삭제할 상품');
    await user.click(screen.getByRole('button', { name: '현재 상품 삭제' }));

    expect(screen.getByLabelText('상품명')).toHaveValue('남는 상품');
    expect(screen.queryByRole('button', { name: '현재 상품 삭제' })).not.toBeInTheDocument();
  });
});
