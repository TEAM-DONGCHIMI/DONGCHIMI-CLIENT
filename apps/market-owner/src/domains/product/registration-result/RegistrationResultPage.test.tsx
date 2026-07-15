import { RouterProvider, createMemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/app/AppProviders';
import {
  usePreparedProductDraftsQuery,
  usePresignedUploadMutation,
  useSavePreparedProductDraftsMutation,
} from '@/domains/product/hooks';
import { useAuthStore } from '@/shared/stores/auth-store';
import { render, screen, userEvent, within } from '@/test';
import { RegistrationResultPage } from './RegistrationResultPage';

vi.mock('@/domains/product/hooks', () => ({
  usePreparedProductDraftsQuery: vi.fn(),
  usePresignedUploadMutation: vi.fn(),
  useSavePreparedProductDraftsMutation: vi.fn(),
}));

const mockedUsePreparedProductDraftsQuery = vi.mocked(usePreparedProductDraftsQuery);
const mockedUsePresignedUploadMutation = vi.mocked(usePresignedUploadMutation);
const mockedUseSavePreparedProductDraftsMutation = vi.mocked(useSavePreparedProductDraftsMutation);

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

const renderPage = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/products/event-discount/new',
        element: <h1>등록 파일 분석</h1>,
      },
      {
        path: '/products/registration-result',
        element: <RegistrationResultPage />,
      },
    ],
    {
      initialEntries: ['/products/registration-result'],
    },
  );

  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
};

describe('RegistrationResultPage', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    useAuthStore.getState().setMarketId(12);
    mockedUsePreparedProductDraftsQuery.mockReturnValue({
      data: preparedDraftsQueryData,
      isError: false,
      isPending: false,
    } as unknown as ReturnType<typeof usePreparedProductDraftsQuery>);
    mockedUseSavePreparedProductDraftsMutation.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
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
    expect(within(breadcrumb).getByText('상품 결과 등록 확인')).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('heading', { name: '상품 결과 등록 확인' })).toBeInTheDocument();
    expect(screen.getByLabelText('고등어 등록 결과')).toBeInTheDocument();
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

    renderPage();

    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(await screen.findByRole('heading', { name: '등록 파일 분석' })).toBeInTheDocument();
  });
});
