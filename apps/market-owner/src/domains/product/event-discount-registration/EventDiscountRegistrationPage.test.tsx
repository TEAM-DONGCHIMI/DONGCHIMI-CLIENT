import { render, screen, userEvent } from '@/test';
import { describe, expect, it } from 'vitest';

import { EventDiscountRegistrationPage } from './EventDiscountRegistrationPage';

describe('EventDiscountRegistrationPage', () => {
  it('switches from file confirmation to file analysis progress', async () => {
    const user = userEvent.setup();

    render(<EventDiscountRegistrationPage />);

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(
      screen.getByRole('heading', { name: 'AI가 상품 정보를 분석하고 있어요' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'AI 분석 진행률' })).toHaveAttribute(
      'aria-valuenow',
      '24',
    );

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
  });
});
