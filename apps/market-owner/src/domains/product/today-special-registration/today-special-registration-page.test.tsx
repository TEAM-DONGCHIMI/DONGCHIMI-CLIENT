import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/app/AppProviders';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { fireEvent, render, screen, userEvent } from '@/test';

import { TodaySpecialRegistrationPage } from './today-special-registration-page';

const { registerDailyProduct, uploadProductImage } = vi.hoisted(() => ({
  registerDailyProduct: vi.fn(),
  uploadProductImage: vi.fn(),
}));

vi.mock('../hooks/use-daily-product-registration-mutation', () => ({
  useDailyProductRegistrationMutation: () => ({ mutateAsync: registerDailyProduct }),
}));

vi.mock('./hooks/use-today-special-image-upload', () => ({
  useTodaySpecialImageUpload: () => ({ uploadProductImage }),
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
    registerDailyProduct.mockReset();
    registerDailyProduct.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });
    uploadProductImage.mockReset();
    uploadProductImage.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps continue registration enabled and completion disabled while fields are empty', () => {
    renderTodaySpecialRegistrationPage();

    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '등록 완료' })).toBeDisabled();
  });

  it('shows field errors without registering when continue registration is invalid', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(await screen.findByText('상품명을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('카테고리를 선택해주세요.')).toBeInTheDocument();
    expect(screen.getByText('오늘의 특가를 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('판매가를 입력해주세요.')).toBeInTheDocument();
    expect(uploadProductImage).not.toHaveBeenCalled();
    expect(registerDailyProduct).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeEnabled();
  });

  it('navigates to today special edit after registration completes', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByText('오늘의 특가 상품 수정 페이지')).toBeInTheDocument();
    expect(uploadProductImage).toHaveBeenCalledWith(
      expect.objectContaining({ imageFile: null, name: '딸기' }),
    );
    expect(registerDailyProduct).toHaveBeenCalledWith({
      marketId: 1,
      request: expect.objectContaining({
        category: 'VEGETABLE_FRUIT',
        discountedPrice: 4500,
        name: '딸기',
        originalPrice: 5000,
        thumbnailUrl: '/images/product-replace.svg',
      }),
    });
  });

  it('uploads a selected product image before completing registration', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });
    const uploadedImageObjectKey = 'tmp/PRODUCT_THUMBNAIL/product.png';

    uploadProductImage.mockResolvedValueOnce(uploadedImageObjectKey);

    renderTodaySpecialRegistrationPage();

    await user.upload(screen.getByLabelText('상품 이미지'), imageFile);
    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(uploadProductImage).toHaveBeenCalledWith(expect.objectContaining({ imageFile }));
    expect(registerDailyProduct).toHaveBeenCalledWith({
      marketId: 1,
      request: expect.objectContaining({
        thumbnailUrl: uploadedImageObjectKey,
      }),
    });
    expect(await screen.findByText('오늘의 특가 상품 수정 페이지')).toBeInTheDocument();
  });

  it('keeps the page open and shows an error toast when image upload fails', async () => {
    const user = userEvent.setup();

    uploadProductImage.mockRejectedValue(new Error('upload failed'));
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '상품을 등록하지 못했습니다. 다시 시도해주세요.',
    );
    expect(screen.queryByText('오늘의 특가 상품 수정 페이지')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료' })).toBeEnabled();
  });

  it('shows the network error message when product registration fails by network error', async () => {
    const user = userEvent.setup();

    registerDailyProduct.mockRejectedValue(new TypeError('Failed to fetch'));
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '인터넷 연결을 확인한 후 다시 시도해주세요.',
    );
    expect(screen.queryByText('오늘의 특가 상품 수정 페이지')).not.toBeInTheDocument();
  });

  it('disables registration actions while continuing registration is pending', async () => {
    const user = userEvent.setup();
    let completeUpload: ((objectKey: string | null) => void) | undefined;

    uploadProductImage.mockReturnValueOnce(
      new Promise((resolve) => {
        completeUpload = resolve;
      }),
    );
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(await screen.findByRole('button', { name: '등록 중' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeDisabled();

    completeUpload?.(null);

    expect(await screen.findByLabelText('상품명')).toHaveValue('');
    expect(screen.queryByText('오늘의 특가 상품 수정 페이지')).not.toBeInTheDocument();
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

  it('keeps the initial event period read-only without opening the date picker', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 11, 9));
    const originalShowPicker = HTMLInputElement.prototype.showPicker;
    const showPicker = vi.fn();

    Object.defineProperty(HTMLInputElement.prototype, 'showPicker', {
      configurable: true,
      value: showPicker,
    });

    try {
      renderTodaySpecialRegistrationPage();

      const startDateInput = screen.getByLabelText('행사 시작일');

      expect(startDateInput).toHaveValue('2026-07-11');
      expect(startDateInput).toHaveAttribute('min', '2026-07-11');
      expect(startDateInput).toHaveAttribute('readonly');
      expect(startDateInput).toHaveAttribute('tabindex', '-1');

      fireEvent.click(startDateInput);
      fireEvent.keyDown(startDateInput, { key: 'Enter' });

      expect(showPicker).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(HTMLInputElement.prototype, 'showPicker', {
        configurable: true,
        value: originalShowPicker,
      });
    }
  });

  it('registers the current product before resetting the form for the next product', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image'], 'first-product.png', { type: 'image/png' });

    renderTodaySpecialRegistrationPage();
    const initialStartDate = (screen.getByLabelText('행사 시작일') as HTMLInputElement).value;

    await user.upload(screen.getByLabelText('상품 이미지'), imageFile);
    await user.type(screen.getByLabelText('상품명'), '첫번째 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');

    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(uploadProductImage).toHaveBeenCalledWith(
      expect.objectContaining({ imageFile, name: '첫번째 상품' }),
    );
    expect(registerDailyProduct).toHaveBeenCalledWith({
      marketId: 1,
      request: expect.objectContaining({
        category: 'VEGETABLE_FRUIT',
        discountedPrice: 4500,
        name: '첫번째 상품',
        originalPrice: 5000,
      }),
    });
    expect(screen.queryByAltText('등록할 상품 이미지 미리보기')).not.toBeInTheDocument();
    expect(screen.getByLabelText('상품명')).toHaveValue('');
    expect(screen.getByRole('button', { name: '카테고리' })).toBeInTheDocument();
    expect(screen.getByLabelText('오늘의 특가')).toHaveValue('');
    expect(screen.getByLabelText('판매가')).toHaveValue('');
    expect(screen.getByLabelText('행사 시작일')).toHaveValue(initialStartDate);
    expect(
      screen.getByRole('heading', { name: /오늘의 특가 상품을 등록하세요/ }),
    ).toHaveTextContent('(2/2)');
    expect(screen.getByRole('button', { name: '이전 상품' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '다음 상품' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeEnabled();
    expect(screen.queryByText('오늘의 특가 상품 수정 페이지')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '이전 상품' }));

    expect(screen.getByLabelText('상품명')).toHaveValue('첫번째 상품');
    expect(screen.getByLabelText('상품명')).toBeDisabled();
    expect(screen.getByRole('button', { name: '등록 완료' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '다음 상품' }));

    expect(screen.getByLabelText('상품명')).toHaveValue('');
    expect(screen.getByLabelText('상품명')).toBeEnabled();
  });

  it('registers the next product without submitting the previous product again', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '첫번째 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    await user.type(screen.getByLabelText('상품명'), '두번째 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('정육/달걀'));
    await user.type(screen.getByLabelText('오늘의 특가'), '6000');
    await user.type(screen.getByLabelText('판매가'), '7000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(registerDailyProduct).toHaveBeenCalledTimes(2);
    expect(registerDailyProduct).toHaveBeenNthCalledWith(2, {
      marketId: 1,
      request: expect.objectContaining({
        category: 'MEAT_EGG',
        discountedPrice: 6000,
        name: '두번째 상품',
        originalPrice: 7000,
      }),
    });
    expect(
      screen.getByRole('heading', { name: /오늘의 특가 상품을 등록하세요/ }),
    ).toHaveTextContent('(3/3)');
  });

  it('cancels only the current unregistered product and can open a new draft again', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '등록된 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    await user.type(screen.getByLabelText('상품명'), '취소할 상품');
    await user.click(screen.getByRole('button', { name: '현재 상품 등록 취소' }));

    expect(registerDailyProduct).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('상품명')).toHaveValue('등록된 상품');
    expect(screen.getByLabelText('상품명')).toBeDisabled();
    expect(screen.queryByRole('button', { name: '현재 상품 등록 취소' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(registerDailyProduct).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('상품명')).toHaveValue('');
    expect(screen.getByLabelText('상품명')).toBeEnabled();
    expect(screen.getByRole('button', { name: '현재 상품 등록 취소' })).toBeInTheDocument();
  });

  it('selects a category from the OverlayKit dropdown', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.click(screen.getByRole('button', { name: '카테고리' }));

    const dropdown = await screen.findByRole('group', { name: '상품 구분 선택' });
    const categoryOptions = Array.from(dropdown.querySelectorAll('button')).map(
      (option) => option.textContent,
    );
    expect(categoryOptions.slice(0, 2)).toEqual(['채소/과일', '정육/달걀']);

    await user.click(await screen.findByText('채소/과일'));

    expect(screen.getByRole('button', { name: '채소/과일' })).toBeInTheDocument();
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

  it('keeps current values when continuing registration fails', async () => {
    const user = userEvent.setup();

    registerDailyProduct.mockRejectedValue(new Error('registration failed'));
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '유지할 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소/과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '상품을 등록하지 못했습니다. 다시 시도해주세요.',
    );
    expect(screen.getByLabelText('상품명')).toHaveValue('유지할 상품');
    expect(screen.getByRole('button', { name: '채소/과일' })).toBeInTheDocument();
    expect(screen.getByLabelText('오늘의 특가')).toHaveValue('4,500');
    expect(screen.getByLabelText('판매가')).toHaveValue('5,000');
    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeEnabled();
  });
});
