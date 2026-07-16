import { ToastProvider } from '@dongchimi/shared/toast';
import { OverlayProvider, overlay } from 'overlay-kit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, userEvent, waitFor, within } from '@/test';
import { registrationResultFixture, type RegistrationResultProduct } from '../fixtures';
import {
  RegistrationResultSection,
  type RegistrationResultSectionProps,
} from './RegistrationResultSection';

const renderSection = (props: Partial<RegistrationResultSectionProps> = {}) => {
  const handlePrevious = props.onPrevious ?? vi.fn();
  const handleRegister = props.onRegister ?? vi.fn();

  render(
    <ToastProvider>
      <OverlayProvider>
        <RegistrationResultSection
          emptyMessage={props.emptyMessage}
          isSavingDrafts={props.isSavingDrafts}
          pageSize={props.pageSize ?? registrationResultFixture.pageSize}
          products={props.products ?? registrationResultFixture.products}
          saveDebounceMs={props.saveDebounceMs}
          summary={props.summary ?? registrationResultFixture.summary}
          onPrevious={handlePrevious}
          onRegister={handleRegister}
          resolveProductImageFileUrl={props.resolveProductImageFileUrl}
          onSaveDrafts={props.onSaveDrafts}
        />
      </OverlayProvider>
    </ToastProvider>,
  );

  return { handlePrevious, handleRegister };
};

const successfulDraftSyncResult = { failCount: 0 };

const createDomRect = ({
  height,
  left,
  top,
  width,
}: {
  height: number;
  left: number;
  top: number;
  width: number;
}): DOMRect => {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
};

afterEach(() => {
  vi.useRealTimers();
  overlay.unmountAll();
});

describe('RegistrationResultSection', () => {
  it('renders Figma result confirmation heading, filters, list, and disabled register action', () => {
    renderSection();

    expect(screen.getByRole('heading', { name: '상품 결과 등록 확인' })).toBeInTheDocument();
    expect(screen.getByText(/AI가 상품 정보를 분석했습니다/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '총 상품 16' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정 필요 12' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('확인이 필요한 상품이 있어요 (12)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료' })).toBeDisabled();
  });

  it('renders four blank product rows whenever the selected segment is empty', async () => {
    const user = userEvent.setup();

    renderSection({
      products: [],
      summary: { completedCount: 0, needsEditCount: 0, totalCount: 0 },
    });

    const expectBlankRows = (segmentLabel: string) => {
      const productList = screen.getByLabelText(`${segmentLabel} 상품 목록`);

      expect(productList.children).toHaveLength(4);
      expect(productList.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4);
      expect(productList).toHaveTextContent('');
    };

    expectBlankRows('수정 필요');

    await user.click(screen.getByRole('button', { name: '총 상품 0' }));
    expectBlankRows('총 상품');

    await user.click(screen.getByRole('button', { name: '등록 완료 0' }));
    expectBlankRows('등록 완료');
  });

  it('renders the completed status chip when no product needs editing', () => {
    const completedProducts = registrationResultFixture.products.filter(
      (product) => product.status === 'completed',
    );

    renderSection({
      products: completedProducts,
      summary: {
        completedCount: completedProducts.length,
        needsEditCount: 0,
        totalCount: completedProducts.length,
      },
    });

    expect(screen.getByText('모든 상품의 확인이 완료되었어요')).toBeVisible();
    expect(screen.queryByText(/확인이 필요한 상품이 있어요/)).not.toBeInTheDocument();
  });

  it('shows the existing image for a completed product', async () => {
    const user = userEvent.setup();

    renderSection();

    await user.click(screen.getByRole('button', { name: '등록 완료 4' }));

    expect(screen.getAllByRole('img', { name: '등록된 상품 이미지' })).toHaveLength(4);
  });

  it('enables selected deletion without changing the server summary count', async () => {
    const user = userEvent.setup();

    renderSection();

    const [, firstProductCheckbox] = screen.getAllByRole('checkbox');

    await user.click(firstProductCheckbox);

    expect(screen.getByText('선택된 상품 (1)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '선택삭제' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '선택삭제' }));

    expect(screen.getByText('선택된 상품 (0)')).toBeInTheDocument();
    expect(screen.getByText('확인이 필요한 상품이 있어요 (12)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정 필요 12' })).toBeInTheDocument();
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

    expect(screen.getByText('1~10')).toBeInTheDocument();
    expect(screen.getAllByLabelText('상품 이미지 파일 선택')).toHaveLength(10);

    await user.click(screen.getByRole('button', { name: '다음 페이지' }));

    expect(screen.getByRole('button', { name: '2 페이지, 현재 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('11~12')).toBeInTheDocument();
    expect(screen.getAllByLabelText('상품 이미지 파일 선택')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '이전 페이지' }));

    expect(screen.getByText('1~10')).toBeInTheDocument();
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
        completedCount: 4,
        needsEditCount: 21,
        totalCount: 25,
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

    await user.click(within(dropdown).getByRole('button', { name: '수산물' }));

    expect(categoryButton).toHaveTextContent('수산물');
  });

  it('keeps the product category dropdown anchored while scrolling', async () => {
    const user = userEvent.setup();

    renderSection();

    const [categoryButton] = screen.getAllByRole('button', { name: '상품 카테고리 선택' });
    const getBoundingClientRectSpy = vi
      .spyOn(categoryButton, 'getBoundingClientRect')
      .mockReturnValue(createDomRect({ height: 40, left: 200, top: 100, width: 206 }));

    await user.click(categoryButton);

    const dropdown = await screen.findByRole('group', { name: '상품 카테고리' });

    expect(dropdown).toHaveStyle({ left: '200px', top: '148px' });

    getBoundingClientRectSpy.mockReturnValue(
      createDomRect({ height: 40, left: 200, top: 40, width: 206 }),
    );
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(dropdown).toHaveStyle({ left: '200px', top: '88px' });
    });

    getBoundingClientRectSpy.mockReturnValue(
      createDomRect({ height: 40, left: 200, top: -60, width: 206 }),
    );
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.queryByRole('group', { name: '상품 카테고리' })).not.toBeInTheDocument();
    });
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

    const [productNameInput] = screen.getAllByPlaceholderText('제품명을 입력하세요');
    const [priceInput] = screen.getAllByPlaceholderText('가격을 입력하세요');

    await user.type(productNameInput, '수정 상품');
    await user.type(priceInput, '4500');

    expect(productNameInput).toHaveValue('수정 상품');
    expect(priceInput).toHaveValue('4500');
  });

  it('renders field validation messages and updates them as values change', async () => {
    const user = userEvent.setup();
    const product: RegistrationResultProduct = {
      category: '가공식품',
      discountPeriod: '',
      id: 'validation-product',
      price: '',
      productName: '',
      promotionText: '',
      status: 'needsEdit',
      statusReason: '입력값 확인 필요',
    };

    renderSection({
      products: [product],
      summary: { completedCount: 0, needsEditCount: 1, totalCount: 1 },
    });

    const productNameInput = screen.getByPlaceholderText('제품명을 입력하세요');
    const priceInput = screen.getByPlaceholderText('가격을 입력하세요');
    const promotionTextInput = screen.getByPlaceholderText('홍보문구를 입력하세요');
    const discountPeriodInput = screen.getByRole('textbox', { name: '상품 할인 기간 입력' });

    expect(productNameInput).not.toHaveAttribute('aria-invalid');
    expect(priceInput).not.toHaveAttribute('aria-invalid');
    expect(discountPeriodInput).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText('상품명을 입력해주세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('가격을 입력해주세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('할인 기간을 입력해주세요.')).not.toBeInTheDocument();

    await user.type(productNameInput, '1');
    await user.clear(productNameInput);

    expect(productNameInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('상품명을 입력해주세요.')).toBeInTheDocument();
    expect(priceInput).toHaveAttribute('aria-invalid', 'true');
    expect(discountPeriodInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('가격을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('할인 기간을 입력해주세요.')).toBeInTheDocument();

    await user.type(productNameInput, '1234567890123456');

    expect(screen.getByText('상품명은 공백 포함 15자 이하로 입력해주세요.')).toBeInTheDocument();

    await user.clear(productNameInput);
    await user.type(productNameInput, '  수정 상품  ');
    await user.tab();

    expect(productNameInput).toHaveValue('수정 상품');
    expect(productNameInput).not.toHaveAttribute('aria-invalid');

    await user.type(priceInput, '1');
    await user.clear(priceInput);

    expect(screen.getByText('가격을 입력해주세요.')).toBeInTheDocument();

    await user.type(priceInput, '12a,900원');

    expect(priceInput).toHaveValue('12900');
    expect(priceInput).not.toHaveAttribute('aria-invalid');

    await user.clear(priceInput);
    await user.type(priceInput, '10000000');

    expect(screen.getByText('9,999,999원 이하로 입력해 주세요.')).toBeInTheDocument();

    await user.clear(priceInput);
    await user.type(priceInput, '9999999');

    expect(priceInput).not.toHaveAttribute('aria-invalid');

    await user.type(promotionTextInput, '1234567890123456789012345678901');

    expect(screen.getByText('홍보문구는 공백 포함 30자 이하로 입력해주세요.')).toBeInTheDocument();

    await user.type(discountPeriodInput, '2026134020260720');

    expect(screen.getByText('올바른 날짜 형식으로 입력해주세요.')).toBeInTheDocument();

    await user.clear(discountPeriodInput);
    await user.type(discountPeriodInput, '2026072020260713');

    expect(screen.getByText('종료일은 시작일 이후 날짜를 선택해주세요.')).toBeInTheDocument();

    await user.clear(discountPeriodInput);
    await user.type(discountPeriodInput, '2026071320260713');

    expect(discountPeriodInput).not.toHaveAttribute('aria-invalid');
  });

  it('keeps the server fail reason unchanged while editing an invalid row', async () => {
    const user = userEvent.setup();
    const product: RegistrationResultProduct = {
      category: '',
      discountPeriod: '',
      id: 'server-fail-reason',
      price: '',
      productName: '',
      promotionText: '',
      status: 'needsEdit',
      statusReason: '서버 failReason 원문',
    };

    renderSection({
      products: [product],
      summary: { completedCount: 0, needsEditCount: 1, totalCount: 1 },
    });

    expect(screen.getByText('서버 failReason 원문')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('제품명을 입력하세요'), '고등어');

    expect(screen.getByText('서버 failReason 원문')).toBeInTheDocument();
    expect(screen.queryByText('이미지 미등록')).not.toBeInTheDocument();
  });

  it('keeps a locally valid needs-edit row pending until the server confirms it', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['preview'], 'preview.png', { type: 'image/png' });
    const product: RegistrationResultProduct = {
      category: '',
      discountPeriod: '',
      id: 'needs-edit-required-fields',
      price: '',
      productName: '',
      promotionText: '',
      status: 'needsEdit',
      statusReason: '필수값 누락',
    };

    renderSection({
      products: [product],
      summary: { completedCount: 0, needsEditCount: 1, totalCount: 1 },
    });

    expect(screen.getByRole('button', { name: '등록 완료 0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정 필요 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await user.upload(screen.getByLabelText(/이미지 파일 선택$/), imageFile);
    await user.type(screen.getByPlaceholderText('제품명을 입력하세요'), '완성 상품');
    await user.type(screen.getByPlaceholderText('가격을 입력하세요'), '4500');
    await user.click(screen.getByRole('button', { name: '완성 상품 카테고리 선택' }));
    await user.click(
      within(await screen.findByRole('group', { name: '상품 카테고리' })).getByRole('button', {
        name: '수산물',
      }),
    );
    await user.type(
      screen.getByRole('textbox', { name: '완성 상품 할인 기간 입력' }),
      '2026071320260720',
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '등록 완료 0' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '수정 필요 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^등록 완료$/ })).toBeDisabled();
    });
  });

  it('shows the remaining row errors after an image-only edit', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['preview'], 'preview.png', { type: 'image/png' });
    const product: RegistrationResultProduct = {
      category: '수산물',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: 'image-and-name-error',
      price: '4000',
      productName: '1234567890123456',
      promotionText: '',
      status: 'needsEdit',
      statusReason: '이미지 누락',
    };

    renderSection({
      products: [product],
      summary: { completedCount: 0, needsEditCount: 1, totalCount: 1 },
    });

    await user.upload(screen.getByLabelText(/이미지 파일 선택$/), imageFile);

    expect(screen.getByText('상품명은 공백 포함 15자 이하로 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('이미지 누락')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료 0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정 필요 1' })).toBeInTheDocument();
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

  it('rejects unsupported product image file types', async () => {
    const textFile = new File(['text'], 'product.txt', { type: 'text/plain' });

    renderSection();

    const [imageInput] = screen.getAllByLabelText('상품 이미지 파일 선택');

    fireEvent.change(imageInput, { target: { files: [textFile] } });

    expect(await screen.findByText('지원하지 않는 파일 형식입니다.')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'product.txt' })).not.toBeInTheDocument();
  });

  it('replaces an existing product image from the uploaded image button', async () => {
    const user = userEvent.setup();
    const replacementImage = new File(['replacement'], 'replacement.png', { type: 'image/png' });
    const productWithExistingImage: RegistrationResultProduct = {
      category: '가공식품',
      discountPeriod: '',
      id: 'needs-edit-with-image',
      imageAlt: '기존 상품 이미지',
      imageUrl: 'https://example.com/product.png',
      price: '',
      productName: '기존 이미지 상품',
      promotionText: '',
      status: 'needsEdit',
      statusReason: '판매가격 미입력',
    };

    renderSection({
      products: [productWithExistingImage],
      summary: {
        completedCount: 0,
        needsEditCount: 1,
        totalCount: 1,
      },
    });

    expect(screen.getByRole('img', { name: '기존 상품 이미지' })).toBeInTheDocument();

    const changeImageButton = screen.getByRole('button', {
      name: '기존 이미지 상품 이미지 변경',
    });
    const imageInputClickSpy = vi
      .spyOn(HTMLInputElement.prototype, 'click')
      .mockImplementation(() => undefined);

    try {
      await user.click(changeImageButton);

      expect(imageInputClickSpy).toHaveBeenCalledTimes(1);
    } finally {
      imageInputClickSpy.mockRestore();
    }

    await user.upload(screen.getByLabelText('기존 이미지 상품 이미지 파일 선택'), replacementImage);

    expect(await screen.findByRole('img', { name: 'replacement.png' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: '기존 상품 이미지' })).not.toBeInTheDocument();
  });

  it('filters products by search value', async () => {
    const user = userEvent.setup();

    renderSection();

    await user.click(screen.getByRole('button', { name: '등록 완료 4' }));
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '고등어');
    await user.keyboard('{Enter}');

    expect(screen.getByLabelText('손질 고등어 2팩 등록 결과')).toBeInTheDocument();
    expect(screen.queryByLabelText('전라도 포기김치 3kg 등록 결과')).not.toBeInTheDocument();
  });

  it('keeps header counts stable while search changes the footer count', async () => {
    const user = userEvent.setup();

    renderSection();

    await user.click(screen.getByRole('button', { name: '등록 완료 4' }));
    expect(screen.getByRole('contentinfo', { name: '페이지네이션 정보' })).toHaveTextContent(
      '전체4개 중1~4표시 중',
    );

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '고등어');

    expect(screen.getByRole('button', { name: '총 상품 16' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정 필요 12' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo', { name: '페이지네이션 정보' })).toHaveTextContent(
      '전체1개 중1~1표시 중',
    );

    await user.clear(screen.getByRole('searchbox', { name: '상품 검색' }));
    await user.click(screen.getByRole('button', { name: '정렬' }));
    await user.click(
      within(await screen.findByRole('group', { name: '카테고리 정렬' })).getByRole('checkbox', {
        name: '수산물',
      }),
    );

    expect(screen.getByRole('button', { name: '총 상품 16' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정 필요 12' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo', { name: '페이지네이션 정보' })).toHaveTextContent(
      '전체1개 중1~1표시 중',
    );
  });

  it('keeps registration disabled until an edited draft is synchronized', async () => {
    vi.useFakeTimers();
    const imageFile = new File(['replacement'], 'replacement.png', { type: 'image/png' });
    const handleSaveDrafts = vi.fn().mockResolvedValue(successfulDraftSyncResult);
    const handleRegister = vi.fn();
    const resolveProductImageFileUrl = vi
      .fn()
      .mockResolvedValue('https://static.dongchimi.kr/replacement.png');
    const product: RegistrationResultProduct = {
      category: '수산물',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: '12',
      imageUrl: 'https://static.dongchimi.kr/product.png',
      price: '4000',
      productName: '고등어',
      promotionText: '맛이 미쳤어요',
      status: 'completed',
    };

    renderSection({
      products: [product],
      summary: { completedCount: 1, needsEditCount: 0, totalCount: 1 },
      onRegister: handleRegister,
      resolveProductImageFileUrl,
      onSaveDrafts: handleSaveDrafts,
    });

    fireEvent.click(screen.getByRole('button', { name: '총 상품 1' }));
    fireEvent.change(screen.getByLabelText('고등어 이미지 파일 선택'), {
      target: { files: [imageFile] },
    });
    expect(screen.getByRole('img', { name: 'replacement.png' })).toBeInTheDocument();
    const priceInput = screen.getByPlaceholderText('가격을 입력하세요');

    fireEvent.change(priceInput, { target: { value: '4500' } });
    expect(screen.getByRole('button', { name: /^등록 완료$/ })).toBeDisabled();

    await vi.advanceTimersByTimeAsync(1_000);

    expect(resolveProductImageFileUrl).toHaveBeenCalledWith(imageFile);
    expect(handleSaveDrafts).toHaveBeenCalledWith({
      preparedProducts: [
        {
          preparedProductId: 12,
          name: '고등어',
          thumbnailUrl: 'https://static.dongchimi.kr/replacement.png',
          discountedPrice: 4500,
          category: 'SEAFOOD',
          promotionalPhrase: '맛이 미쳤어요',
          discountStartDate: '2026-07-15',
          discountEndDate: '2026-07-21',
          dealType: 'PERIODIC',
        },
      ],
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(screen.getByRole('button', { name: /^등록 완료$/ })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: /^등록 완료$/ }));
    await vi.advanceTimersByTimeAsync(0);

    expect(handleSaveDrafts).toHaveBeenCalledTimes(2);
    expect(handleRegister).toHaveBeenCalledTimes(1);
    expect(handleSaveDrafts.mock.invocationCallOrder[1]).toBeLessThan(
      handleRegister.mock.invocationCallOrder[0],
    );
  });

  it('forces a final draft save before completing registration without local changes', async () => {
    const user = userEvent.setup();
    const handleSaveDrafts = vi.fn().mockResolvedValue(successfulDraftSyncResult);
    const handleRegister = vi.fn();
    const product: RegistrationResultProduct = {
      category: '수산물',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: '12',
      imageUrl: 'https://static.dongchimi.kr/product.png',
      price: '4000',
      productName: '고등어',
      promotionText: '맛이 미쳤어요',
      status: 'completed',
    };

    renderSection({
      products: [product],
      summary: { completedCount: 1, needsEditCount: 0, totalCount: 1 },
      onRegister: handleRegister,
      onSaveDrafts: handleSaveDrafts,
    });

    await user.click(screen.getByRole('button', { name: /^등록 완료$/ }));

    await waitFor(() => {
      expect(handleSaveDrafts).toHaveBeenCalledWith({
        preparedProducts: [
          {
            preparedProductId: 12,
            name: '고등어',
            thumbnailUrl: 'https://static.dongchimi.kr/product.png',
            discountedPrice: 4000,
            category: 'SEAFOOD',
            promotionalPhrase: '맛이 미쳤어요',
            discountStartDate: '2026-07-15',
            discountEndDate: '2026-07-21',
            dealType: 'PERIODIC',
          },
        ],
      });
    });
    expect(handleRegister).toHaveBeenCalledTimes(1);
  });

  it('does not complete registration when the final draft save fails', async () => {
    const user = userEvent.setup();
    const handleSaveDrafts = vi.fn().mockRejectedValue(new Error('save failed'));
    const handleRegister = vi.fn();
    const product: RegistrationResultProduct = {
      category: '수산물',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: '12',
      imageUrl: 'https://static.dongchimi.kr/product.png',
      price: '4000',
      productName: '고등어',
      promotionText: '',
      status: 'completed',
    };

    renderSection({
      products: [product],
      summary: { completedCount: 1, needsEditCount: 0, totalCount: 1 },
      onRegister: handleRegister,
      onSaveDrafts: handleSaveDrafts,
    });

    await user.click(screen.getByRole('button', { name: /^등록 완료$/ }));

    await waitFor(() => {
      expect(handleSaveDrafts).toHaveBeenCalledTimes(1);
    });
    expect(handleRegister).not.toHaveBeenCalled();
  });

  it('keeps the edited row dirty when an automatic save fails', async () => {
    vi.useFakeTimers();
    const handleSaveDrafts = vi.fn().mockRejectedValue(new Error('save failed'));
    const product: RegistrationResultProduct = {
      category: '수산물',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: '12',
      imageUrl: 'https://static.dongchimi.kr/product.png',
      price: '4000',
      productName: '고등어',
      promotionText: '',
      status: 'completed',
    };

    renderSection({
      products: [product],
      saveDebounceMs: 1_000,
      summary: { completedCount: 1, needsEditCount: 0, totalCount: 1 },
      onSaveDrafts: handleSaveDrafts,
    });

    fireEvent.click(screen.getByRole('button', { name: '등록 완료 1' }));
    fireEvent.change(screen.getByPlaceholderText('가격을 입력하세요'), {
      target: { value: '5000' },
    });
    await vi.advanceTimersByTimeAsync(1_000);
    await vi.advanceTimersByTimeAsync(0);

    expect(handleSaveDrafts).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert')).toHaveTextContent('임시 저장에 실패했습니다.');
    expect(screen.getByPlaceholderText('가격을 입력하세요')).toHaveValue('5000');
    expect(screen.getByRole('button', { name: /^등록 완료$/ })).toBeDisabled();
  });

  it('auto-saves the latest draft once after the trailing debounce expires', async () => {
    vi.useFakeTimers();
    const handleSaveDrafts = vi.fn().mockResolvedValue(successfulDraftSyncResult);
    const product: RegistrationResultProduct = {
      category: '수산물',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: '12',
      imageUrl: 'https://static.dongchimi.kr/product.png',
      price: '4000',
      productName: '고등어',
      promotionText: '',
      status: 'completed',
    };

    renderSection({
      products: [product],
      saveDebounceMs: 1_000,
      summary: { completedCount: 1, needsEditCount: 0, totalCount: 1 },
      onSaveDrafts: handleSaveDrafts,
    });

    fireEvent.click(screen.getByRole('button', { name: '등록 완료 1' }));
    fireEvent.change(screen.getByPlaceholderText('가격을 입력하세요'), {
      target: { value: '5000' },
    });

    await vi.advanceTimersByTimeAsync(500);
    fireEvent.change(screen.getByPlaceholderText('가격을 입력하세요'), {
      target: { value: '5500' },
    });
    await vi.advanceTimersByTimeAsync(500);

    expect(handleSaveDrafts).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(500);

    expect(handleSaveDrafts).toHaveBeenCalledTimes(1);
    expect(handleSaveDrafts).toHaveBeenCalledWith({
      preparedProducts: [
        expect.objectContaining({
          discountedPrice: 5500,
          preparedProductId: 12,
        }),
      ],
    });

    await vi.advanceTimersByTimeAsync(2_000);
    expect(handleSaveDrafts).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByPlaceholderText('가격을 입력하세요'), {
      target: { value: '6000' },
    });
    await vi.advanceTimersByTimeAsync(1_000);

    expect(handleSaveDrafts).toHaveBeenCalledTimes(2);
    expect(handleSaveDrafts).toHaveBeenLastCalledWith({
      preparedProducts: [
        expect.objectContaining({
          discountedPrice: 6000,
          preparedProductId: 12,
        }),
      ],
    });
  });

  it('serializes saves and preserves a newer row revision for the follow-up request', async () => {
    vi.useFakeTimers();
    let resolveFirstSave: (result: typeof successfulDraftSyncResult) => void = () => undefined;
    const firstSavePromise = new Promise<typeof successfulDraftSyncResult>((resolve) => {
      resolveFirstSave = resolve;
    });
    const handleSaveDrafts = vi
      .fn()
      .mockImplementationOnce(() => firstSavePromise)
      .mockResolvedValue(successfulDraftSyncResult);
    const product: RegistrationResultProduct = {
      category: '수산물',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: '12',
      imageUrl: 'https://static.dongchimi.kr/product.png',
      price: '4000',
      productName: '고등어',
      promotionText: '',
      status: 'completed',
    };

    renderSection({
      products: [product],
      saveDebounceMs: 1_000,
      summary: { completedCount: 1, needsEditCount: 0, totalCount: 1 },
      onSaveDrafts: handleSaveDrafts,
    });

    fireEvent.click(screen.getByRole('button', { name: '등록 완료 1' }));
    fireEvent.change(screen.getByPlaceholderText('가격을 입력하세요'), {
      target: { value: '5000' },
    });
    await vi.advanceTimersByTimeAsync(1_000);

    expect(handleSaveDrafts).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByPlaceholderText('가격을 입력하세요'), {
      target: { value: '6000' },
    });
    await vi.advanceTimersByTimeAsync(1_000);

    expect(handleSaveDrafts).toHaveBeenCalledTimes(1);

    resolveFirstSave(successfulDraftSyncResult);
    await vi.advanceTimersByTimeAsync(0);

    expect(handleSaveDrafts).toHaveBeenCalledTimes(2);
    expect(handleSaveDrafts).toHaveBeenLastCalledWith({
      preparedProducts: [
        expect.objectContaining({
          discountedPrice: 6000,
          preparedProductId: 12,
        }),
      ],
    });
  });

  it('stops scheduled draft saves as soon as the previous action starts route exit', async () => {
    vi.useFakeTimers();
    const handlePrevious = vi.fn();
    const handleSaveDrafts = vi.fn().mockResolvedValue(successfulDraftSyncResult);
    const product: RegistrationResultProduct = {
      category: '수산물',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: '12',
      imageUrl: 'https://static.dongchimi.kr/product.png',
      price: '4000',
      productName: '고등어',
      promotionText: '',
      status: 'completed',
    };

    renderSection({
      products: [product],
      saveDebounceMs: 1_000,
      summary: { completedCount: 1, needsEditCount: 0, totalCount: 1 },
      onPrevious: handlePrevious,
      onSaveDrafts: handleSaveDrafts,
    });

    fireEvent.click(screen.getByRole('button', { name: '등록 완료 1' }));
    fireEvent.change(screen.getByPlaceholderText('가격을 입력하세요'), {
      target: { value: '5000' },
    });
    fireEvent.click(screen.getByRole('button', { name: '이전' }));

    await vi.advanceTimersByTimeAsync(2_000);

    expect(handlePrevious).toHaveBeenCalledTimes(1);
    expect(handleSaveDrafts).not.toHaveBeenCalled();
  });
});
