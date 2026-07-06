import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/test';
import { registrationResultFixture } from '../fixtures';
import { RegistrationResultSection } from './RegistrationResultSection';

const renderSection = () => {
  const handlePrevious = vi.fn();
  const handleRegister = vi.fn();

  render(
    <RegistrationResultSection
      pageSize={registrationResultFixture.pageSize}
      products={registrationResultFixture.products}
      summary={registrationResultFixture.summary}
      onPrevious={handlePrevious}
      onRegister={handleRegister}
    />,
  );

  return { handlePrevious, handleRegister };
};

describe('RegistrationResultSection', () => {
  it('renders Figma result confirmation heading, filters, list, and disabled register action', () => {
    renderSection();

    expect(screen.getByRole('heading', { name: '상품 결과 등록 확인' })).toBeInTheDocument();
    expect(screen.getByText(/AI가 상품 정보를 분석했습니다/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '총 상품 128' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료 112' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정 필요 12' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('확인이 필요한 상품이 있어요 (12)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료' })).toBeDisabled();
  });

  it('enables selected deletion and updates the needs-edit notice count', async () => {
    const user = userEvent.setup();

    renderSection();

    const [, firstProductCheckbox] = screen.getAllByRole('checkbox');

    await user.click(firstProductCheckbox);

    expect(screen.getByText('선택된 상품 (1)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '선택삭제' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '선택삭제' }));

    expect(screen.getByText('선택된 상품 (0)')).toBeInTheDocument();
    expect(screen.getByText('확인이 필요한 상품이 있어요 (11)')).toBeInTheDocument();
  });

  it('filters products by search value', async () => {
    const user = userEvent.setup();

    renderSection();

    await user.click(screen.getByRole('button', { name: '등록 완료 112' }));
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '고등어');
    await user.keyboard('{Enter}');

    expect(screen.getByLabelText('손질 고등어 2팩 등록 결과')).toBeInTheDocument();
    expect(screen.queryByLabelText('전라도 포기김치 3kg 등록 결과')).not.toBeInTheDocument();
  });
});
