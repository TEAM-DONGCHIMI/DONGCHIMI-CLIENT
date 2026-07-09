import { OverlayProvider, overlay } from 'overlay-kit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, within } from '@/test';
import { registrationResultFixture } from '../fixtures';
import { RegistrationResultSection } from './RegistrationResultSection';

const renderSection = () => {
  const handlePrevious = vi.fn();
  const handleRegister = vi.fn();

  render(
    <OverlayProvider>
      <RegistrationResultSection
        pageSize={registrationResultFixture.pageSize}
        products={registrationResultFixture.products}
        summary={registrationResultFixture.summary}
        onPrevious={handlePrevious}
        onRegister={handleRegister}
      />
    </OverlayProvider>,
  );

  return { handlePrevious, handleRegister };
};

afterEach(() => {
  overlay.unmountAll();
});

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

  it('shows mixed all-selection state and selects every visible row from the header checkbox', async () => {
    const user = userEvent.setup();

    renderSection();

    const [allCheckbox, firstProductCheckbox] = screen.getAllByRole('checkbox');

    await user.click(firstProductCheckbox);

    expect(allCheckbox).toHaveAttribute('aria-checked', 'mixed');

    await user.click(allCheckbox);

    expect(allCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('선택된 상품 (10)')).toBeInTheDocument();
  });

  it('opens category filter dropdown from the sort action', async () => {
    const user = userEvent.setup();

    renderSection();

    const sortButton = screen.getByRole('button', { name: '정렬' });

    await user.click(sortButton);

    const dropdown = await screen.findByRole('group', { name: '카테고리 정렬' });

    expect(sortButton).toHaveAttribute('aria-expanded', 'true');
    expect(within(dropdown).getByRole('checkbox', { name: '전체' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await user.click(within(dropdown).getByRole('checkbox', { name: '정육･달걀' }));

    expect(within(dropdown).getByRole('checkbox', { name: '정육･달걀' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await user.click(sortButton);

    expect(sortButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('group', { name: '카테고리 정렬' })).not.toBeInTheDocument();
  });

  it('opens product category dropdown and updates the row category', async () => {
    const user = userEvent.setup();

    renderSection();

    const [categoryButton] = screen.getAllByRole('button', { name: '상품 카테고리 선택' });

    await user.click(categoryButton);

    const dropdown = await screen.findByRole('menu', { name: '상품 카테고리' });

    await user.click(within(dropdown).getByRole('button', { name: '수산' }));

    expect(categoryButton).toHaveTextContent('수산');
  });

  it('uploads a product image preview from the image field', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['preview'], 'preview.png', { type: 'image/png' });

    renderSection();

    const [imageInput] = screen.getAllByLabelText('상품 이미지 파일 선택');

    await user.upload(imageInput, imageFile);

    expect(await screen.findByRole('img', { name: 'preview.png' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '상품 이미지 변경' })).toBeInTheDocument();
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
