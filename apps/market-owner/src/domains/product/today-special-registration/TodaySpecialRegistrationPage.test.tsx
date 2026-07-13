import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/app/AppProviders';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { fireEvent, render, screen, userEvent } from '@/test';

import { TodaySpecialRegistrationPage } from './TodaySpecialRegistrationPage';

const { uploadProductImages } = vi.hoisted(() => ({
  uploadProductImages: vi.fn(),
}));

vi.mock('./hooks/useTodaySpecialImageUpload', () => ({
  useTodaySpecialImageUpload: () => ({ uploadProductImages }),
}));

const renderTodaySpecialRegistrationPage = () => {
  return render(
    <MemoryRouter initialEntries={[MARKET_OWNER_ROUTES.todaySpecialRegistration]}>
      <AppProviders>
        <Routes>
          <Route
            element={<TodaySpecialRegistrationPage />}
            path={MARKET_OWNER_ROUTES.todaySpecialRegistration}
          />
          <Route
            element={<div>오늘의 특가 상품 수정 페이지</div>}
            path={MARKET_OWNER_ROUTES.todaySpecialEdit}
          />
        </Routes>
      </AppProviders>
    </MemoryRouter>,
  );
};

describe('TodaySpecialRegistrationPage', () => {
  beforeEach(() => {
    uploadProductImages.mockReset();
    uploadProductImages.mockResolvedValue([null]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps submit disabled while required fields are empty', () => {
    renderTodaySpecialRegistrationPage();

    expect(screen.getByRole('button', { name: '등록 완료' })).toBeDisabled();
  });

  it('navigates to today special edit after registration completes', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByText('오늘의 특가 상품 수정 페이지')).toBeInTheDocument();
    expect(uploadProductImages).toHaveBeenCalledWith([
      expect.objectContaining({ imageFile: null, name: '딸기' }),
    ]);
  });

  it('uploads a selected product image before completing registration', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });

    renderTodaySpecialRegistrationPage();

    await user.upload(screen.getByLabelText('상품 이미지'), imageFile);
    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(uploadProductImages).toHaveBeenCalledWith([expect.objectContaining({ imageFile })]);
    expect(await screen.findByText('오늘의 특가 상품 수정 페이지')).toBeInTheDocument();
  });

  it('keeps the page open and shows an error toast when image upload fails', async () => {
    const user = userEvent.setup();

    uploadProductImages.mockRejectedValue(new Error('upload failed'));
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이미지를 업로드하지 못했습니다. 다시 시도해주세요.',
    );
    expect(screen.queryByText('오늘의 특가 상품 수정 페이지')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료' })).toBeEnabled();
  });

  it('disables registration actions while images are uploading', async () => {
    const user = userEvent.setup();
    let completeUpload: ((objectKeys: (string | null)[]) => void) | undefined;

    uploadProductImages.mockReturnValueOnce(
      new Promise((resolve) => {
        completeUpload = resolve;
      }),
    );
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByRole('button', { name: '등록 중' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeDisabled();

    completeUpload?.([null]);

    expect(await screen.findByText('오늘의 특가 상품 수정 페이지')).toBeInTheDocument();
  });

  it('limits product text fields including spaces', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    const productNameInput = screen.getByLabelText('상품명');
    const promotionTextInput = screen.getByLabelText('상품 한줄 홍보문구');

    expect(productNameInput).toHaveAttribute('maxlength', '15');
    expect(promotionTextInput).toHaveAttribute('maxlength', '25');

    await user.type(productNameInput, '12345 7890123456');
    await user.type(promotionTextInput, '1234567890 1234567890 12345');

    expect(productNameInput).toHaveValue('12345 789012345');
    expect(promotionTextInput).toHaveValue('1234567890 1234567890 123');
  });

  it('sets today as the initial event period and minimum selectable date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 11, 9));

    renderTodaySpecialRegistrationPage();

    expect(screen.getByLabelText('행사 시작일')).toHaveValue('2026-07-11');
    expect(screen.getByLabelText('행사 시작일')).toHaveAttribute('min', '2026-07-11');
  });

  it('starts an added product draft from today as the event period', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 11, 9));

    renderTodaySpecialRegistrationPage();

    fireEvent.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(screen.getByLabelText('행사 시작일')).toHaveValue('2026-07-11');
  });

  it('selects a category from the OverlayKit dropdown', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.click(screen.getByRole('button', { name: '카테고리' }));

    const dropdown = await screen.findByRole('group', { name: '상품 구분 선택' });
    const categoryOptions = Array.from(dropdown.querySelectorAll('button')).map(
      (option) => option.textContent,
    );
    expect(categoryOptions.slice(0, 2)).toEqual(['전체', '채소･과일']);

    await user.click(await screen.findByText('채소･과일'));

    expect(screen.getByRole('button', { name: '채소･과일' })).toBeInTheDocument();
  });

  it('keeps category dropdown open while its list or page scrolls', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.click(screen.getByRole('button', { name: '카테고리' }));

    const dropdown = await screen.findByRole('group', { name: '상품 구분 선택' });

    fireEvent.scroll(dropdown);
    expect(dropdown).toBeInTheDocument();

    fireEvent.scroll(document);
    expect(dropdown).toBeInTheDocument();
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
