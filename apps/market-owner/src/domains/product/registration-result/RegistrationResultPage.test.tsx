import { RouterProvider, createMemoryRouter, useLocation } from 'react-router';
import type * as TanStackReactQuery from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/app/AppProviders';
import {
  usePreparedProductDraftsQuery,
  usePresignedUploadMutation,
  useSavePreparedProductDraftsMutation,
} from '@/domains/product/hooks';
import {
  createProductImportRouteState,
  getProductImportFileConfirmation,
} from '@/domains/product/model/product-import-route-state';
import { useAuthStore } from '@/shared/stores/auth-store';
import { render, screen, userEvent, within } from '@/test';
import { RegistrationResultPage } from './RegistrationResultPage';

const { invalidateQueries } = vi.hoisted(() => ({
  invalidateQueries: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof TanStackReactQuery>()),
  useQueryClient: () => ({ invalidateQueries }),
}));

vi.mock('@/domains/product/hooks', () => ({
  usePreparedProductDraftsQuery: vi.fn(),
  usePresignedUploadMutation: vi.fn(),
  useSavePreparedProductDraftsMutation: vi.fn(),
}));

const mockedUsePreparedProductDraftsQuery = vi.mocked(usePreparedProductDraftsQuery);
const mockedUsePresignedUploadMutation = vi.mocked(usePresignedUploadMutation);
const mockedUseSavePreparedProductDraftsMutation = vi.mocked(useSavePreparedProductDraftsMutation);
const mockedSavePreparedProductDrafts = vi.fn();
const mockedRefetchPreparedProductDrafts = vi.fn();

const FileAnalysisRouteStateProbe = () => {
  const location = useLocation();
  const fileConfirmation = getProductImportFileConfirmation(location.state);

  return fileConfirmation == null ? (
    <h1>상품 등록</h1>
  ) : (
    <>
      <h1>등록한 파일을 확인해주세요</h1>
      <p>{fileConfirmation.fileName}</p>
    </>
  );
};

const preparedDraftsQueryData = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    totalCount: 1,
    successCount: 0,
    failCount: 1,
    preparedProducts: [
      {
        preparedProductId: 12,
        name: '고등어',
        thumbnailUrl: null,
        discountedPrice: 4000,
        category: 'SEAFOOD',
        promotionalPhrase: '맛이 미쳤어요',
        discountStartDate: '2026-07-15',
        discountEndDate: '2026-07-21',
        draftStatus: 'FAIL',
        failReason: '이미지 누락',
      },
    ],
  },
} as const;

const completedPreparedDraftsQueryData = {
  ...preparedDraftsQueryData,
  data: {
    ...preparedDraftsQueryData.data,
    successCount: 1,
    failCount: 0,
    preparedProducts: [
      {
        ...preparedDraftsQueryData.data.preparedProducts[0],
        thumbnailUrl: 'https://static.dongchimi.kr/product.png',
        draftStatus: 'SUCCESS',
        failReason: null,
      },
    ],
  },
} as const;

const renderPage = (initialState?: unknown) => {
  const router = createMemoryRouter(
    [
      {
        path: '/products/event-discount/new',
        element: <FileAnalysisRouteStateProbe />,
      },
      {
        path: '/products/registration-result',
        element: <RegistrationResultPage />,
      },
      {
        path: '/leaflets/share',
        element: <h1>오늘의 전단 최종 확인</h1>,
      },
    ],
    {
      initialEntries: [{ pathname: '/products/registration-result', state: initialState }],
    },
  );

  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );

  return router;
};

describe('RegistrationResultPage', () => {
  beforeEach(() => {
    invalidateQueries.mockClear();
    mockedSavePreparedProductDrafts.mockReset().mockResolvedValue(undefined);
    mockedRefetchPreparedProductDrafts.mockReset().mockResolvedValue({
      data: preparedDraftsQueryData,
      isError: false,
    });
    useAuthStore.getState().clearSession();
    useAuthStore.getState().setMarketId(12);
    mockedUsePreparedProductDraftsQuery.mockReturnValue({
      data: preparedDraftsQueryData,
      isError: false,
      isPending: false,
      refetch: mockedRefetchPreparedProductDrafts,
    } as unknown as ReturnType<typeof usePreparedProductDraftsQuery>);
    mockedUseSavePreparedProductDraftsMutation.mockReturnValue({
      isPending: false,
      mutateAsync: mockedSavePreparedProductDrafts,
    } as unknown as ReturnType<typeof useSavePreparedProductDraftsMutation>);
    mockedUsePresignedUploadMutation.mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof usePresignedUploadMutation>);
  });

  it('renders no-sidebar upload header and registration result section', () => {
    renderPage();

    const breadcrumb = screen.getByRole('navigation', { name: '현재 위치' });

    expect(breadcrumb).toBeInTheDocument();
    expect(screen.getByText('행사 할인 상품 등록')).toBeInTheDocument();
    expect(within(breadcrumb).getByText('상품 등록 결과 확인')).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('heading', { name: '상품 등록 결과 확인' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '동치미' })).toHaveAttribute(
      'src',
      expect.stringContaining('Img_pavicon.svg'),
    );
    expect(screen.getByRole('img', { name: '동치미' })).toHaveAttribute('width', '92');
    expect(screen.getByRole('img', { name: '동치미' })).toHaveAttribute('height', '32');
    expect(screen.getByLabelText('고등어 등록 결과')).toBeInTheDocument();
    expect(screen.getByText('이미지 누락')).toBeInTheDocument();
    expect(screen.queryByText('이미지 미등록')).not.toBeInTheDocument();
    expect(mockedUsePreparedProductDraftsQuery).toHaveBeenCalledWith({
      categories: [],
      fetchAll: true,
      marketId: 12,
      page: 0,
      search: '',
      size: 100,
    });
  });

  it('routes to file analysis page when previous action is clicked', async () => {
    const user = userEvent.setup();
    const fileConfirmationState = createProductImportRouteState({
      fileName: '상품목록_202607.xlsx',
      fileUrl: 'https://static.dongchimi.kr/test/상품목록_202607.xlsx',
    });

    const router = renderPage(fileConfirmationState);

    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(
      await screen.findByRole('heading', { name: '등록한 파일을 확인해주세요' }),
    ).toBeInTheDocument();
    expect(screen.getByText('상품목록_202607.xlsx')).toBeInTheDocument();
    expect(router.state.location.state).toEqual(fileConfirmationState);
  });

  it('saves the final drafts and routes to the leaflet confirmation page', async () => {
    const user = userEvent.setup();

    mockedUsePreparedProductDraftsQuery.mockReturnValue({
      data: completedPreparedDraftsQueryData,
      isError: false,
      isPending: false,
      refetch: mockedRefetchPreparedProductDrafts,
    } as unknown as ReturnType<typeof usePreparedProductDraftsQuery>);
    mockedRefetchPreparedProductDrafts.mockResolvedValue({
      data: completedPreparedDraftsQueryData,
      isError: false,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: /^등록 완료$/ }));

    expect(mockedSavePreparedProductDrafts).toHaveBeenCalledWith({
      marketId: 12,
      request: {
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
      },
    });
    expect(mockedRefetchPreparedProductDrafts).toHaveBeenCalledTimes(1);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['leaflet-share', 'periodic-preview', 12],
    });
    expect(
      await screen.findByRole('heading', { name: '오늘의 전단 최종 확인' }),
    ).toBeInTheDocument();
  });

  it('keeps a failed final save on the page and shows the toast at top center', async () => {
    const user = userEvent.setup();

    mockedUsePreparedProductDraftsQuery.mockReturnValue({
      data: completedPreparedDraftsQueryData,
      isError: false,
      isPending: false,
      refetch: mockedRefetchPreparedProductDrafts,
    } as unknown as ReturnType<typeof usePreparedProductDraftsQuery>);
    mockedRefetchPreparedProductDrafts.mockResolvedValue({
      data: completedPreparedDraftsQueryData,
      isError: false,
    });
    mockedSavePreparedProductDrafts.mockRejectedValueOnce(new Error('save failed'));

    renderPage();

    await user.click(screen.getByRole('button', { name: /^등록 완료$/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('임시 저장에 실패했습니다.');
    expect(screen.getByRole('region', { name: '토스트 알림' })).toHaveAttribute(
      'data-placement',
      'top-center',
    );
    expect(screen.getByRole('heading', { name: '상품 등록 결과 확인' })).toBeInTheDocument();
  });

  it('stays on the result page when the refreshed server draft still fails', async () => {
    const user = userEvent.setup();

    mockedUsePreparedProductDraftsQuery.mockReturnValue({
      data: completedPreparedDraftsQueryData,
      isError: false,
      isPending: false,
      refetch: mockedRefetchPreparedProductDrafts,
    } as unknown as ReturnType<typeof usePreparedProductDraftsQuery>);
    mockedRefetchPreparedProductDrafts.mockResolvedValue({
      data: preparedDraftsQueryData,
      isError: false,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: /^등록 완료$/ }));

    expect(mockedSavePreparedProductDrafts).toHaveBeenCalledTimes(1);
    expect(mockedRefetchPreparedProductDrafts).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading', { name: '상품 등록 결과 확인' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: '오늘의 전단 최종 확인' }),
    ).not.toBeInTheDocument();
  });
});
