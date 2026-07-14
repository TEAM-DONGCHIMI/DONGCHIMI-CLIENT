import { RouterProvider, createMemoryRouter } from 'react-router';
import { fireEvent, render, screen, userEvent } from '@/test';
import { ToastProvider } from '@dongchimi/shared/toast';
import { describe, expect, it, vi } from 'vitest';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { QueryProvider } from '@/shared/query';

import {
  EventDiscountRegistrationPage,
  type EventDiscountRegistrationPageProps,
} from './EventDiscountRegistrationPage';
import type { StartProductImportParams } from './api';

vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: () => <span aria-hidden='true' data-testid='file-analysis-spinner' />,
}));

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

const renderEventDiscountRegistrationPage = (
  props: Partial<EventDiscountRegistrationPageProps> = {},
) => {
  const resolveExcelFileUrl = props.resolveExcelFileUrl ?? createMockResolveExcelFileUrl();
  const startProductImport = props.startProductImport ?? createMockStartProductImport();
  const router = createMemoryRouter(
    [
      {
        path: MARKET_OWNER_ROUTES.eventDiscountRegistration,
        element: (
          <EventDiscountRegistrationPage
            marketId={12}
            resolveExcelFileUrl={resolveExcelFileUrl}
            startProductImport={startProductImport}
          />
        ),
      },
      {
        path: MARKET_OWNER_ROUTES.registrationResult,
        element: <h1>상품 결과 등록 확인</h1>,
      },
    ],
    {
      initialEntries: [MARKET_OWNER_ROUTES.eventDiscountRegistration],
    },
  );
  const renderResult = render(
    <QueryProvider>
      <ToastProvider defaultDurationMs={null}>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryProvider>,
  );

  return { ...renderResult, resolveExcelFileUrl, router, startProductImport };
};

describe('EventDiscountRegistrationPage', () => {
  it('switches from registration method to file confirmation and analysis progress', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const { startProductImport } = renderEventDiscountRegistrationPage();

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
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '파일 업로드' }));

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
    expect(screen.getByText('상품목록_202607.xlsx')).toBeInTheDocument();

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
    expect(screen.getByRole('progressbar', { name: 'AI 분석 진행률' })).toHaveAttribute(
      'aria-valuenow',
      '24',
    );

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.getByRole('heading', { name: '등록한 파일을 확인해주세요' })).toBeInTheDocument();
  });

  it('navigates to the registration result page after fixture analysis completes', async () => {
    const user = userEvent.setup();
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const { router } = renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);
    await user.click(screen.getByRole('button', { name: '파일 업로드' }));
    await user.click(screen.getByRole('button', { name: '분석 시작' }));

    expect(screen.getByRole('progressbar', { name: 'AI 분석 진행률' })).toHaveAttribute(
      'aria-valuenow',
      '24',
    );

    expect(
      await screen.findByRole('heading', { name: '상품 결과 등록 확인' }, { timeout: 6_500 }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.registrationResult);
  }, 7_000);

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

  it('shows toast feedback when excel upload fails', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const resolveExcelFileUrl = vi
      .fn()
      .mockRejectedValue(new Error('엑셀 파일 크기가 너무 큽니다.'));
    const excelFile = new File(['name,price'], '상품목록_202607.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    renderEventDiscountRegistrationPage({ resolveExcelFileUrl });

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));
    await user.upload(screen.getByLabelText('파일 선택'), excelFile);
    await user.click(screen.getByRole('button', { name: '파일 업로드' }));

    expect(screen.getByRole('alert')).toHaveTextContent('엑셀 파일 크기가 너무 큽니다.');
    expect(screen.getAllByText('엑셀 파일 크기가 너무 큽니다.')).toHaveLength(2);
    expect(screen.getByRole('dialog', { name: '엑셀 파일 업로드' })).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
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
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeEnabled();
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
    await user.click(screen.getByRole('button', { name: '파일 업로드' }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.getByRole('heading', { name: '상품 등록' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '엑셀 업로드' }));

    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();
    expect(screen.getByText('지원 파일은 .xlsx, .csv예요.')).toBeInTheDocument();
  });

  it('renders toast feedback and POS guide panel from method actions', async () => {
    const user = userEvent.setup();

    renderEventDiscountRegistrationPage();

    await user.click(screen.getByRole('button', { name: '엑셀 양식 다운로드' }));

    const successToast = screen.getByRole('status');

    expect(successToast).toHaveTextContent('엑셀 양식 다운로드 완료');
    expect(successToast.querySelector('svg')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'POS에서 엑셀 파일 받는 방법 보기' }));

    expect(screen.getByRole('dialog', { name: posGuideDialogName })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'POS 안내 닫기' }));

    expect(screen.queryByRole('dialog', { name: posGuideDialogName })).toBeNull();

    await user.click(screen.getByRole('button', { name: '전단지 업로드' }));

    const errorToast = screen.getByRole('alert');

    expect(errorToast).toHaveTextContent('아직 준비중인 기능이에요.');
    expect(errorToast.querySelector('svg')).toBeInTheDocument();
  });
});
