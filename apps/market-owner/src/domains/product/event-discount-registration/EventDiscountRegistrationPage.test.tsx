import { RouterProvider, createMemoryRouter } from 'react-router';
import { fireEvent, render, screen, userEvent, waitFor } from '@/test';
import { ToastProvider } from '@dongchimi/shared/toast';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { QueryProvider } from '@/shared/query';
import { useAuthStore } from '@/shared/stores/auth-store';
import { createProductImportRouteState } from '@/domains/product/model/product-import-route-state';

import {
  EXCEL_TEMPLATE_DOWNLOAD_URL,
  EventDiscountRegistrationPage,
  type EventDiscountRegistrationPageProps,
} from './EventDiscountRegistrationPage';
import type { StartProductImportParams, SubscribeProductImportProgressParams } from './api';
import type { ProductImportProgressDataTypes } from './model';

vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: () => <span aria-hidden='true' data-testid='file-analysis-spinner' />,
}));

afterEach(() => {
  useAuthStore.getState().clearSession();
});

const posGuideDialogName = /POS에서 엑셀 파일을\s+이렇게 다운 받으시면 돼요\./;

const createMockResolveExcelFileUrl = () => {
  return vi.fn((file: File) => `https://static.dongchimi.kr/test/${file.name}`);
};

const createMockStartProductImport = () => {
  return vi.fn((params: StartProductImportParams) => {
    void params;

    return Promise.resolve({
      jobId: 'job-123',
    });
  });
};

const productImportProgressData: ProductImportProgressDataTypes = {
  jobId: 'job-123',
  status: 'IN_PROGRESS',
  progress: 24,
  remainingSeconds: 30,
  currentStep: 'NAME_EXTRACTION',
  steps: [
    { step: 'FILE_UPLOAD', status: 'COMPLETED' },
    { step: 'NAME_EXTRACTION', status: 'IN_PROGRESS' },
    { step: 'PRICE_EXTRACTION', status: 'PENDING' },
    { step: 'CATEGORY_CLASSIFICATION', status: 'PENDING' },
    { step: 'IMAGE_MATCHING', status: 'PENDING' },
  ],
};

const waitForAbort = (signal: AbortSignal) => {
  if (signal.aborted) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    signal.addEventListener('abort', () => resolve(), { once: true });
  });
};

const createMockProductImportLifecycle = () => {
  const subscribeProductImportProgress = vi.fn(
    async ({ onEvent, signal }: SubscribeProductImportProgressParams) => {
      onEvent({ data: productImportProgressData, type: 'progress' });
      await waitForAbort(signal);
    },
  );
  const cancelProductImport = vi.fn(async () => undefined);

  return { cancelProductImport, subscribeProductImportProgress };
};

const createDeferred = <ValueTypes,>() => {
  let resolve!: (value: ValueTypes) => void;
  const promise = new Promise<ValueTypes>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
};

const renderEventDiscountRegistrationPage = (
  props: Partial<EventDiscountRegistrationPageProps> = {},
  options: { initialState?: unknown; omitMarketId?: boolean } = {},
) => {
  const resolveExcelFileUrl = props.resolveExcelFileUrl ?? createMockResolveExcelFileUrl();
  const startProductImport = props.startProductImport ?? createMockStartProductImport();
  const productImportLifecycle = createMockProductImportLifecycle();
  const cancelProductImport =
    props.cancelProductImport ?? productImportLifecycle.cancelProductImport;
  const subscribeProductImportProgress =
    props.subscribeProductImportProgress ?? productImportLifecycle.subscribeProductImportProgress;
  const router = createMemoryRouter(
    [
      {
        path: MARKET_OWNER_ROUTES.eventDiscountRegistration,
        element: (
          <EventDiscountRegistrationPage
            cancelProductImport={cancelProductImport}
            marketId={options.omitMarketId ? undefined : (props.marketId ?? 12)}
            resolveExcelFileUrl={resolveExcelFileUrl}
            startProductImport={startProductImport}
            subscribeProductImportProgress={subscribeProductImportProgress}
          />
        ),
      },
      {
        path: MARKET_OWNER_ROUTES.registrationResult,
        element: <h1>상품 등록 결과 확인</h1>,
      },
    ],
    {
      initialEntries: [
        {
          pathname: MARKET_OWNER_ROUTES.eventDiscountRegistration,
          state: options.initialState,
        },
      ],
    },
  );
  const renderResult = render(
    <QueryProvider>
      <ToastProvider defaultDurationMs={null}>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryProvider>,
  );

  return {
    ...renderResult,
    cancelProductImport,
    resolveExcelFileUrl,
    router,
    startProductImport,
    subscribeProductImportProgress,
  };
};

describe('EventDiscountRegistrationPage', () => {
  it('shows file confirmation after upload and starts analysis only from the confirmation action', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const {
      cancelProductImport,
      resolveExcelFileUrl,
      startProductImport,
      subscribeProductImportProgress,
    } = renderEventDiscountRegistrationPage();

    expect(screen.getByRole('heading', { name: '상품 등록' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));

    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByText(/상품이 등록된 엑셀 파일을 선택해주세요/)).toBeInTheDocument();
    expect(screen.getByText(/업로드하면 상품이 자동으로 등록됩니다/)).toBeInTheDocument();
    expect(screen.getByText('지원 파일은 .xlsx, .csv예요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();

    await user.upload(screen.getByLabelText('파일 선택'), excelFile);

    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByText('선택한 파일')).toBeInTheDocument();
    expect(screen.getByText('상품목록_202607.xlsx')).toBeInTheDocument();
    expect(screen.queryByText('지원 파일은 .xlsx, .csv예요.')).toBeNull();
    expect(resolveExcelFileUrl).toHaveBeenCalledWith(excelFile);
    expect(startProductImport).not.toHaveBeenCalled();

    const uploadButton = screen.getByRole('button', { name: '파일 업로드' });

    await waitFor(() => {
      expect(uploadButton).toBeEnabled();
    });

    await user.click(uploadButton);

    expect(screen.queryByRole('dialog', { name: '엑셀 파일 업로드' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
    expect(screen.getByText('상품목록_202607.xlsx')).toBeInTheDocument();
    expect(startProductImport).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(startProductImport).toHaveBeenCalledWith({
      marketId: 12,
      request: {
        excelFileUrl: 'https://static.dongchimi.kr/test/상품목록_202607.xlsx',
      },
    });
    expect(
      screen.getByRole('heading', { name: 'AI가 상품 정보를 분석하고 있어요' }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('progressbar', { name: 'AI 분석 진행률' })).toHaveAttribute(
        'aria-valuenow',
        '20',
      );
    });
    expect(subscribeProductImportProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        jobId: 'job-123',
        marketId: 12,
      }),
    );

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(vi.mocked(cancelProductImport).mock.calls[0]?.[0]).toEqual({
      jobId: 'job-123',
      marketId: 12,
    });
    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
    expect(screen.getByText('상품목록_202607.xlsx')).toBeInTheDocument();
  });

  it('uses the market id stored from the login session on the routed page', async () => {
    const user = userEvent.setup();
    const startProductImport = createMockStartProductImport();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    useAuthStore.getState().setAccessToken('access-token', { isAutoLogin: false, marketId: 27 });
    renderEventDiscountRegistrationPage({ startProductImport }, { omitMarketId: true });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);

    const uploadButton = screen.getByRole('button', { name: '파일 업로드' });

    await waitFor(() => {
      expect(uploadButton).toBeEnabled();
    });

    await user.click(uploadButton);

    expect(startProductImport).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(startProductImport).toHaveBeenCalledWith({
      marketId: 27,
      request: {
        excelFileUrl: 'https://static.dongchimi.kr/test/상품목록_202607.xlsx',
      },
    });
  });

  it('navigates to the registration result page after the completed event', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const subscribeProductImportProgress = vi.fn(
      async ({ onEvent }: SubscribeProductImportProgressParams) => {
        onEvent({
          data: {
            jobId: 'job-123',
            status: 'COMPLETED',
            progress: 100,
            totalCount: 128,
            successCount: 116,
            failCount: 12,
          },
          type: 'completed',
        });
      },
    );
    const { router } = renderEventDiscountRegistrationPage({
      subscribeProductImportProgress,
    });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);
    await user.click(screen.getByRole('button', { name: '파일 업로드' }));
    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(await screen.findByRole('heading', { name: '상품 등록 결과 확인' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.registrationResult);
    expect(router.state.location.state).toEqual(
      createProductImportRouteState({
        fileName: '상품목록_202607.xlsx',
        fileUrl: 'https://static.dongchimi.kr/test/상품목록_202607.xlsx',
      }),
    );

    await router.navigate(-1);

    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.eventDiscountRegistration);
    expect(
      await screen.findByRole('heading', { name: '등록한 파일을 확인해주세요' }),
    ).toBeInTheDocument();
    expect(screen.getByText('상품목록_202607.xlsx')).toBeInTheDocument();
  });

  it('shows the server message and returns to confirmation after the failed event', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const subscribeProductImportProgress = vi.fn(
      async ({ onEvent }: SubscribeProductImportProgressParams) => {
        onEvent({
          data: {
            jobId: 'job-123',
            status: 'FAILED',
            code: 'ANALYSIS_FAILED',
            message: '상품 정보 분석에 실패했습니다.',
          },
          type: 'failed',
        });
      },
    );

    renderEventDiscountRegistrationPage({ subscribeProductImportProgress });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);
    await user.click(screen.getByRole('button', { name: '파일 업로드' }));
    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('상품 정보 분석에 실패했습니다.');
    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
  });

  it('shows the server message and keeps progress active when cancel fails', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const cancelProductImport = vi.fn().mockRejectedValue(
      new ApiError({
        code: 'JOB_NOT_FOUND',
        message: '존재하지 않는 분석 작업입니다.',
        status: 404,
        type: 'client',
      }),
    );

    renderEventDiscountRegistrationPage({ cancelProductImport });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);
    await user.click(screen.getByRole('button', { name: '파일 업로드' }));
    await user.click(screen.getByRole('button', { name: '분석 시작' }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('존재하지 않는 분석 작업입니다.');
    expect(
      screen.getByRole('heading', { name: 'AI가 상품 정보를 분석하고 있어요' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeEnabled();
  });

  it('shows an error state when an unsupported file is selected', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'leaflet.png', { type: 'image/png' });

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    fireEvent.change(screen.getByLabelText('파일 선택'), {
      target: {
        files: [file],
      },
    });

    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByText('파일을 선택하지 못했습니다. 다시 선택해주세요.')).toBeInTheDocument();
    expect(screen.queryByText('leaflet.png')).toBeNull();
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();
  });

  it('shows the server message when the excel upload API fails', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const uploadError = new ApiError({
      code: 'FILE_SIZE_EXCEEDED',
      message: '엑셀 파일 크기가 너무 큽니다.',
      status: 413,
      type: 'client',
    });
    const resolveExcelFileUrl = vi.fn().mockRejectedValue(uploadError);
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage({ resolveExcelFileUrl });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);

    expect(await screen.findByRole('alert')).toHaveTextContent('엑셀 파일 크기가 너무 큽니다.');
    expect(screen.getAllByText('엑셀 파일 크기가 너무 큽니다.')).toHaveLength(2);
    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '토스트 알림' })).toHaveAttribute(
      'data-placement',
      'bottom-center',
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[EventDiscountRegistration] Failed to upload excel file',
      uploadError,
    );

    consoleErrorSpy.mockRestore();
  });

  it('uses a user-facing fallback when the excel upload fails outside the API client', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const resolveExcelFileUrl = vi
      .fn()
      .mockRejectedValue(new Error('Failed to upload file to presigned URL.'));
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage({ resolveExcelFileUrl });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '파일 업로드에 실패했습니다. 다시 시도해주세요.',
    );
    expect(screen.getAllByText('파일 업로드에 실패했습니다. 다시 시도해주세요.')).toHaveLength(2);

    consoleErrorSpy.mockRestore();
  });

  it('shows the server message when starting product analysis fails', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const analysisError = new ApiError({
      code: 'UNAUTHORIZED',
      message: '인증이 필요합니다.',
      status: 401,
      type: 'auth',
    });
    const startProductImport = vi.fn().mockRejectedValue(analysisError);
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage({ startProductImport });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);

    const uploadButton = screen.getByRole('button', { name: '파일 업로드' });

    await waitFor(() => {
      expect(uploadButton).toBeEnabled();
    });

    await user.click(uploadButton);

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(screen.getByRole('alert')).toHaveTextContent('인증이 필요합니다.');
    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[EventDiscountRegistration] Failed to start product import',
      analysisError,
    );

    consoleErrorSpy.mockRestore();
  });

  it('keeps the upload button disabled until the presigned upload completes', async () => {
    const user = userEvent.setup();
    const deferredUpload = createDeferred<string>();
    const resolveExcelFileUrl = vi.fn(() => deferredUpload.promise);
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage({ resolveExcelFileUrl });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);

    const uploadButton = screen.getByRole('button', { name: '파일 업로드' });

    expect(uploadButton).toBeDisabled();

    deferredUpload.resolve('https://static.dongchimi.kr/test/products.xlsx');

    await waitFor(() => {
      expect(uploadButton).toBeEnabled();
    });
  });

  it('selects an excel file through drag and drop', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_드롭.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    fireEvent.drop(screen.getByText(/상품이 등록된 엑셀 파일을 선택해주세요/), {
      dataTransfer: {
        files: [excelFile],
      },
    });

    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByText('선택한 파일')).toBeInTheDocument();
    expect(screen.getByText('상품목록_드롭.xlsx')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '파일 업로드' })).toBeEnabled();
    });
  });

  it('shows an error state when an unsupported file is dropped', async () => {
    const user = userEvent.setup();
    const invalidFile = new File(['image'], 'leaflet.png', { type: 'image/png' });

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    fireEvent.drop(screen.getByText(/상품이 등록된 엑셀 파일을 선택해주세요/), {
      dataTransfer: {
        files: [invalidFile],
      },
    });

    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();
    expect(screen.getByText('파일을 선택하지 못했습니다. 다시 선택해주세요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();
  });

  it('clears the uploaded file when file confirmation is canceled', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);
    const uploadButton = screen.getByRole('button', { name: '파일 업로드' });

    await waitFor(() => {
      expect(uploadButton).toBeEnabled();
    });

    await user.click(uploadButton);

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.getByRole('heading', { name: '상품 등록' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));

    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();
    expect(screen.getByText('지원 파일은 .xlsx, .csv예요.')).toBeInTheDocument();
  });

  it('restores the uploaded file confirmation from route state', () => {
    renderEventDiscountRegistrationPage(
      {},
      {
        initialState: createProductImportRouteState({
          fileName: '이전상품목록.xlsx',
          fileUrl: 'https://static.dongchimi.kr/test/previous.xlsx',
        }),
      },
    );

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
    expect(screen.getByText('이전상품목록.xlsx')).toBeInTheDocument();
  });

  it('opens the excel template download URL and renders the remaining method actions', async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 양식 다운로드' }));

    expect(open).toHaveBeenCalledWith(EXCEL_TEMPLATE_DOWNLOAD_URL, '_blank', 'noopener');

    await user.click(screen.getByRole('button', { name: 'POS에서 엑셀 파일 받는 방법 보기' }));

    expect(screen.getByRole('dialog', { name: posGuideDialogName })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'POS 안내 닫기' }));

    expect(screen.queryByRole('dialog', { name: posGuideDialogName })).toBeNull();

    await user.click(screen.getByRole('button', { name: '전단지 업로드' }));

    const errorToast = screen.getByRole('alert');

    expect(errorToast).toHaveTextContent('아직 준비중인 기능이에요.');
    expect(screen.getByTestId('toast-error-icon')).toBeInTheDocument();
  });
});
