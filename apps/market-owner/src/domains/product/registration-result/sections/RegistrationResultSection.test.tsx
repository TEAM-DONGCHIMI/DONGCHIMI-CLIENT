import { ToastProvider } from '@dongchimi/shared/toast';
import { OverlayProvider, overlay } from 'overlay-kit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, within } from '@/test';
import { registrationResultFixture } from '../fixtures';
import {
  RegistrationResultSection,
  type RegistrationResultSectionProps,
} from './RegistrationResultSection';

const renderSection = (props: Partial<RegistrationResultSectionProps> = {}) => {
  const handlePrevious = vi.fn();
  const handleRegister = vi.fn();

  render(
    <ToastProvider>
      <OverlayProvider>
        <RegistrationResultSection
          pageSize={props.pageSize ?? registrationResultFixture.pageSize}
          products={props.products ?? registrationResultFixture.products}
          summary={props.summary ?? registrationResultFixture.summary}
          onPrevious={handlePrevious}
          onRegister={handleRegister}
        />
      </OverlayProvider>
    </ToastProvider>,
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
    expect(screen.getByRole('button', { name: '총 상품 124' })).toBeInTheDocument();
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

  it('moves between pages and updates the visible row range', async () => {
    const user = userEvent.setup();

    renderSection();

    expect(screen.getByText('1-10')).toBeInTheDocument();
    expect(screen.getAllByLabelText('상품 이미지 파일 선택')).toHaveLength(10);

    await user.click(screen.getByRole('button', { name: '다음 페이지' }));

    expect(screen.getByRole('button', { name: '2 페이지, 현재 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('11-12')).toBeInTheDocument();
    expect(screen.getAllByLabelText('상품 이미지 파일 선택')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '이전 페이지' }));

    expect(screen.getByText('1-10')).toBeInTheDocument();
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

  it('closes category filter dropdown with Escape', async () => {
    const user = userEvent.setup();

    renderSection();

    const sortButton = screen.getByRole('button', { name: '정렬' });

    await user.click(sortButton);

    expect(await screen.findByRole('group', { name: '카테고리 정렬' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(sortButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('group', { name: '카테고리 정렬' })).not.toBeInTheDocument();
  });

  it('renders every available pagination page without capping the list at two pages', () => {
    const additionalNeedsEditProducts = Array.from({ length: 9 }, (_, index) => {
      const productNumber = index + 13;

      return {
        category: '가공식품',
        discountPeriod: '',
        id: `needs-edit-${String(productNumber).padStart(3, '0')}`,
        price: '',
        productName: '',
        promotionText: '',
        status: 'needsEdit' as const,
        statusReason: '판매가격 미입력',
      };
    });

    renderSection({
      products: [...registrationResultFixture.products, ...additionalNeedsEditProducts],
      summary: {
        completedCount: 112,
        needsEditCount: 21,
        totalCount: 133,
      },
    });

    expect(screen.getByRole('button', { name: '3 페이지' })).toBeInTheDocument();
  });

  it('opens product category dropdown and updates the row category', async () => {
    const user = userEvent.setup();

    renderSection();

    const [categoryButton] = screen.getAllByRole('button', { name: '상품 카테고리 선택' });

    expect(categoryButton).toHaveTextContent('가공식품');

    await user.click(categoryButton);

    const dropdown = await screen.findByRole('group', { name: '상품 카테고리' });

    await user.click(within(dropdown).getByRole('button', { name: '수산' }));

    expect(categoryButton).toHaveTextContent('수산');
  });

  it('formats discount period while typing date digits', async () => {
    const user = userEvent.setup();

    renderSection();

    const [discountPeriodInput] = screen.getAllByRole('textbox', { name: '상품 할인 기간 입력' });

    await user.type(discountPeriodInput, '2026063020260702');

    expect(discountPeriodInput).toHaveValue('2026-06-30 ~ 2026-07-02');
  });

  it('keeps edited product field values in the result row', async () => {
    const user = userEvent.setup();

    renderSection();

    const [productNameInput] = screen.getAllByPlaceholderText('제품명을 입력하세요.');
    const [priceInput] = screen.getAllByPlaceholderText('가격을 입력하세요.');

    await user.type(productNameInput, '수정 상품');
    await user.type(priceInput, '4500');

    expect(productNameInput).toHaveValue('수정 상품');
    expect(priceInput).toHaveValue('4500');
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
