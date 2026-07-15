import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/app/AppProviders';
import { ApiError } from '@/shared/api/api-error';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';
import { act, fireEvent, render, screen, userEvent, waitFor } from '@/test';

import { TodaySpecialRegistrationPage } from './today-special-registration-page';

const {
  deleteProduct,
  deleteProducts,
  registerDailyProduct,
  resetProducts,
  updateProduct,
  uploadProductImage,
  uploadProductThumbnail,
} = vi.hoisted(() => ({
  deleteProduct: vi.fn(),
  deleteProducts: vi.fn(),
  registerDailyProduct: vi.fn(),
  resetProducts: vi.fn(),
  updateProduct: vi.fn(),
  uploadProductImage: vi.fn(),
  uploadProductThumbnail: vi.fn(),
}));

vi.mock('../api/delete-products', () => ({
  deleteProduct,
  deleteProducts,
  resetProducts,
}));

vi.mock('../api/update-product', () => ({
  updateProduct,
}));

vi.mock('../hooks/use-daily-product-registration-mutation', () => ({
  useDailyProductRegistrationMutation: () => ({ mutateAsync: registerDailyProduct }),
}));

vi.mock('./hooks/use-today-special-image-upload', () => ({
  useTodaySpecialImageUpload: () => ({ uploadProductImage }),
}));

vi.mock('../hooks/use-product-thumbnail-upload', () => ({
  useProductThumbnailUpload: () => ({ uploadProductThumbnail }),
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
          <Route
            element={<div>마트 정보 등록 페이지</div>}
            path={MARKET_OWNER_ROUTES.marketInformationRegistration}
          />
        </Routes>
      </AppProviders>
    </MemoryRouter>,
  );
};

describe('TodaySpecialRegistrationPage', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_PUBLIC_S3_BASE_URL', 'https://static.example.com/');
    useAuthStore.getState().setMarketId(12);
    registerDailyProduct.mockReset();
    let nextProductId = 101;

    registerDailyProduct.mockImplementation(async () => ({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: { productId: nextProductId++ },
    }));
    deleteProduct.mockReset();
    deleteProduct.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });
    deleteProducts.mockReset();
    resetProducts.mockReset();
    updateProduct.mockReset();
    updateProduct.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });
    uploadProductImage.mockReset();
    uploadProductImage.mockResolvedValue(null);
    uploadProductThumbnail.mockReset();
    uploadProductThumbnail.mockResolvedValue(
      'https://static.example.com/tmp/PRODUCT_THUMBNAIL/updated.png',
    );
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('redirects to market information registration when the login store has no market ID', async () => {
    useAuthStore.getState().setMarketId(undefined);

    renderTodaySpecialRegistrationPage();

    expect(await screen.findByText('마트 정보 등록 페이지')).toBeInTheDocument();
    expect(screen.queryByText('오늘의 특가 상품을 등록하세요')).not.toBeInTheDocument();
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
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByText('오늘의 특가 상품 수정 페이지')).toBeInTheDocument();
    expect(uploadProductImage).toHaveBeenCalledWith(
      expect.objectContaining({ imageFile: null, name: '딸기' }),
    );
    expect(registerDailyProduct).toHaveBeenCalledWith({
      marketId: 12,
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
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(uploadProductImage).toHaveBeenCalledWith(expect.objectContaining({ imageFile }));
    expect(registerDailyProduct).toHaveBeenCalledWith({
      marketId: 12,
      request: expect.objectContaining({
        thumbnailUrl: 'https://static.example.com/tmp/PRODUCT_THUMBNAIL/product.png',
      }),
    });
    expect(await screen.findByText('오늘의 특가 상품 수정 페이지')).toBeInTheDocument();
  });

  it('does not upload an image when the S3 base URL is missing', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });

    vi.stubEnv('VITE_PUBLIC_S3_BASE_URL', '');
    renderTodaySpecialRegistrationPage();

    await user.upload(screen.getByLabelText('상품 이미지'), imageFile);
    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(uploadProductImage).not.toHaveBeenCalled();
    expect(registerDailyProduct).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      '상품을 등록하지 못했습니다. 다시 시도해주세요.',
    );
  });

  it('keeps the page open and shows an error toast when image upload fails', async () => {
    const user = userEvent.setup();

    uploadProductImage.mockRejectedValue(new Error('upload failed'));
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '상품을 등록하지 못했습니다. 다시 시도해주세요.',
    );
    expect(screen.getByTestId('today-special-registration-error-toast-icon')).toBeInTheDocument();
    expect(screen.queryByText('오늘의 특가 상품 수정 페이지')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록 완료' })).toBeEnabled();
  });

  it('shows the network error message when product registration fails by network error', async () => {
    const user = userEvent.setup();

    registerDailyProduct.mockRejectedValue(new TypeError('Failed to fetch'));
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '딸기');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '등록 완료' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '인터넷 연결을 확인한 후 다시 시도해주세요.',
    );
    expect(screen.getByTestId('today-special-registration-error-toast-icon')).toBeInTheDocument();
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
    await user.click(await screen.findByText('채소･과일'));
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
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');

    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(uploadProductImage).toHaveBeenCalledWith(
      expect.objectContaining({ imageFile, name: '첫번째 상품' }),
    );
    expect(registerDailyProduct).toHaveBeenCalledWith({
      marketId: 12,
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
    expect(screen.getByLabelText('상품명')).toBeEnabled();
    expect(screen.getByRole('button', { name: '수정 완료' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '다음 상품' }));

    expect(screen.getByLabelText('상품명')).toHaveValue('');
    expect(screen.getByLabelText('상품명')).toBeEnabled();
  });

  it('registers the next product without submitting the previous product again', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '첫번째 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    await user.type(screen.getByLabelText('상품명'), '두번째 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('정육･달걀'));
    await user.type(screen.getByLabelText('오늘의 특가'), '6000');
    await user.type(screen.getByLabelText('판매가'), '7000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(registerDailyProduct).toHaveBeenCalledTimes(2);
    expect(registerDailyProduct).toHaveBeenNthCalledWith(2, {
      marketId: 12,
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
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    await user.type(screen.getByLabelText('상품명'), '취소할 상품');
    await user.click(screen.getByRole('button', { name: '현재 상품 등록 취소' }));

    expect(registerDailyProduct).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('상품명')).toHaveValue('등록된 상품');
    expect(screen.getByLabelText('상품명')).toBeEnabled();
    expect(screen.queryByRole('button', { name: '현재 상품 등록 취소' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(registerDailyProduct).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('상품명')).toHaveValue('');
    expect(screen.getByLabelText('상품명')).toBeEnabled();
    expect(screen.getByRole('button', { name: '현재 상품 등록 취소' })).toBeInTheDocument();
  });

  it('updates a registered product without uploading its unchanged image', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '수정 전 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));
    await user.click(screen.getByRole('button', { name: '이전 상품' }));

    await user.clear(screen.getByLabelText('상품명'));
    await user.type(screen.getByLabelText('상품명'), '수정 후 상품');
    await user.click(screen.getByRole('button', { name: '수정 완료' }));

    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalledWith({
        marketId: 12,
        productId: 101,
        request: {
          category: 'VEGETABLE_FRUIT',
          discountedPrice: 4500,
          discountEndDate: expect.any(String),
          discountStartDate: expect.any(String),
          name: '수정 후 상품',
          originalPrice: 5000,
          promotionalPhrase: null,
          thumbnailUrl: '/images/product-replace.svg',
          type: 'DAILY',
        },
      });
    });
    expect(uploadProductThumbnail).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: '다음 상품' }));
    await user.click(screen.getByRole('button', { name: '이전 상품' }));

    expect(screen.getByLabelText('상품명')).toHaveValue('수정 후 상품');
  });

  it('uploads a changed registered image and stores the new server URL in its snapshot', async () => {
    const user = userEvent.setup();
    const updatedImage = new File(['updated'], 'updated.png', { type: 'image/png' });

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '이미지 수정 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));
    await user.click(screen.getByRole('button', { name: '이전 상품' }));
    await user.upload(screen.getByLabelText('상품 이미지'), updatedImage);
    await user.click(screen.getByRole('button', { name: '수정 완료' }));

    await waitFor(() => expect(uploadProductThumbnail).toHaveBeenCalledWith(updatedImage));
    expect(updateProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        marketId: 12,
        productId: 101,
        request: expect.objectContaining({
          thumbnailUrl: 'https://static.example.com/tmp/PRODUCT_THUMBNAIL/updated.png',
        }),
      }),
    );
    expect(screen.getByAltText('등록할 상품 이미지 미리보기')).toHaveAttribute(
      'src',
      'https://static.example.com/tmp/PRODUCT_THUMBNAIL/updated.png',
    );
  });

  it('locks product controls while a registered product update is pending', async () => {
    const user = userEvent.setup();
    let completeUpdate:
      | ((response: { code: 'SUCCESS'; message: string; success: true }) => void)
      | undefined;

    updateProduct.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          completeUpdate = resolve;
        }),
    );
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '수정 대기 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));
    await user.click(screen.getByRole('button', { name: '이전 상품' }));
    await user.click(screen.getByRole('button', { name: '수정 완료' }));

    expect(await screen.findByRole('button', { name: '수정 중' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 상품' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '등록 상품 삭제' })).toBeDisabled();

    await act(async () => {
      completeUpdate?.({
        success: true,
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
      });
    });

    expect(await screen.findByRole('button', { name: '수정 완료' })).toBeEnabled();
  });

  it('keeps edited registered values when the update request fails', async () => {
    const user = userEvent.setup();

    updateProduct.mockRejectedValueOnce(
      new ApiError({
        code: 'PRODUCT_UPDATE_FAILED',
        message: '상품 수정에 실패했습니다.',
        status: 500,
        type: 'server',
      }),
    );
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '유지할 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));
    await user.click(screen.getByRole('button', { name: '이전 상품' }));
    await user.clear(screen.getByLabelText('상품명'));
    await user.type(screen.getByLabelText('상품명'), '실패해도 유지할 값');
    await user.click(screen.getByRole('button', { name: '수정 완료' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('상품 수정에 실패했습니다.');
    expect(screen.getByLabelText('상품명')).toHaveValue('실패해도 유지할 값');
    expect(screen.getByRole('button', { name: '수정 완료' })).toBeEnabled();
  });

  it('confirms registered product deletion and preserves the current draft after success', async () => {
    const user = userEvent.setup();
    let completeDeletion:
      | ((response: { code: 'SUCCESS'; message: string; success: true }) => void)
      | undefined;

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '등록된 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));
    await user.type(screen.getByLabelText('상품명'), '작성 중인 상품');
    await user.click(screen.getByRole('button', { name: '이전 상품' }));

    await user.click(screen.getByRole('button', { name: '등록 상품 삭제' }));
    expect(screen.getByRole('dialog')).toHaveAccessibleName('정말 삭제하시겠어요?');
    expect(screen.queryByText('행사 기간이 아직 남았어요.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(deleteProduct).not.toHaveBeenCalled();

    deleteProduct.mockReturnValueOnce(
      new Promise((resolve) => {
        completeDeletion = resolve;
      }),
    );
    await user.click(screen.getByRole('button', { name: '등록 상품 삭제' }));
    await user.click(screen.getByRole('button', { name: '삭제하기' }));

    expect(screen.getByRole('button', { name: '삭제 중' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
    expect(deleteProduct).toHaveBeenCalledWith({
      marketId: 12,
      productId: 101,
      request: { forceDelete: true },
    });

    await act(async () => {
      completeDeletion?.({
        success: true,
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
      });
    });

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByLabelText('상품명')).toHaveValue('작성 중인 상품');
    expect(screen.getByLabelText('상품명')).toBeEnabled();
    expect(screen.queryByRole('button', { name: '등록 상품 삭제' })).not.toBeInTheDocument();
  });

  it('reflows product order after deleting the first registered snapshot', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '첫번째 등록 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    await user.type(screen.getByLabelText('상품명'), '두번째 등록 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('정육･달걀'));
    await user.type(screen.getByLabelText('오늘의 특가'), '6000');
    await user.type(screen.getByLabelText('판매가'), '7000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));
    await user.type(screen.getByLabelText('상품명'), '작성 중인 세번째 상품');

    await user.click(screen.getByRole('button', { name: '이전 상품' }));
    await user.click(screen.getByRole('button', { name: '이전 상품' }));
    await user.click(screen.getByRole('button', { name: '등록 상품 삭제' }));
    await user.click(screen.getByRole('button', { name: '삭제하기' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(deleteProduct).toHaveBeenCalledWith({
      marketId: 12,
      productId: 101,
      request: { forceDelete: true },
    });
    expect(
      screen.getByRole('heading', { name: /오늘의 특가 상품을 등록하세요/ }),
    ).toHaveTextContent('(1/2)');
    expect(screen.getByLabelText('상품명')).toHaveValue('두번째 등록 상품');
    expect(screen.getByLabelText('상품명')).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '다음 상품' }));
    expect(screen.getByLabelText('상품명')).toHaveValue('작성 중인 세번째 상품');
    expect(screen.getByLabelText('상품명')).toBeEnabled();
  });

  it('keeps the registered snapshot and confirmation modal when deletion fails', async () => {
    const user = userEvent.setup();

    deleteProduct.mockRejectedValueOnce(
      new ApiError({
        code: 'PRODUCT_NOT_FOUND',
        message: '상품을 삭제하지 못했습니다. 다시 시도해주세요.',
        status: 404,
        type: 'server',
      }),
    );
    renderTodaySpecialRegistrationPage();

    await user.type(screen.getByLabelText('상품명'), '유지할 등록 상품');
    await user.click(screen.getByRole('button', { name: '카테고리' }));
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));
    await user.click(screen.getByRole('button', { name: '이전 상품' }));
    await user.click(screen.getByRole('button', { name: '등록 상품 삭제' }));
    await user.click(screen.getByRole('button', { name: '삭제하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '상품을 삭제하지 못했습니다. 다시 시도해주세요.',
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('상품명')).toHaveValue('유지할 등록 상품');
    expect(screen.getByLabelText('상품명')).toBeEnabled();
  });

  it('selects a category from the OverlayKit dropdown', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    await user.click(screen.getByRole('button', { name: '카테고리' }));

    const dropdown = await screen.findByRole('group', { name: '상품 구분 선택' });
    const categoryOptions = Array.from(dropdown.querySelectorAll('button')).map(
      (option) => option.textContent,
    );
    expect(categoryOptions.slice(0, 2)).toEqual(['채소･과일', '정육･달걀']);

    await user.click(await screen.findByText('채소･과일'));

    expect(screen.getByRole('button', { name: '채소･과일' })).toBeInTheDocument();
  });

  it('keeps category dropdown open while its list or page scrolls', async () => {
    const user = userEvent.setup();

    renderTodaySpecialRegistrationPage();

    vi.stubGlobal('innerHeight', 500);
    const categoryTrigger = screen.getByRole('button', { name: '카테고리' });
    vi.spyOn(categoryTrigger, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 300, 206, 40),
    );

    await user.click(categoryTrigger);

    const dropdown = await screen.findByRole('group', { name: '상품 구분 선택' });

    expect(dropdown.style.getPropertyValue('--product-category-dropdown-max-height')).toBe('112px');
    expect(getComputedStyle(dropdown).overflowY).toBe('auto');

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
    await user.click(await screen.findByText('채소･과일'));
    await user.type(screen.getByLabelText('오늘의 특가'), '4500');
    await user.type(screen.getByLabelText('판매가'), '5000');
    await user.click(screen.getByRole('button', { name: '상품 계속 등록' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '상품을 등록하지 못했습니다. 다시 시도해주세요.',
    );
    expect(screen.getByLabelText('상품명')).toHaveValue('유지할 상품');
    expect(screen.getByRole('button', { name: '채소･과일' })).toBeInTheDocument();
    expect(screen.getByLabelText('오늘의 특가')).toHaveValue('4,500');
    expect(screen.getByLabelText('판매가')).toHaveValue('5,000');
    expect(screen.getByRole('button', { name: '상품 계속 등록' })).toBeEnabled();
  });
});
