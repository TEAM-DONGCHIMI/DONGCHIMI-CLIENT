import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ownerHomeFixture } from '@/domains/home/fixtures/owner-home-api.fixture';
import { useOwnerHomeQuery } from '@/domains/home/hooks/use-owner-home-query';
import { render, screen } from '@/test';

import { HomeDashboardSection } from './HomeDashboardSection';

vi.mock('@/domains/home/hooks/use-owner-home-query', () => ({
  useOwnerHomeQuery: vi.fn(),
}));

const mockedUseOwnerHomeQuery = vi.mocked(useOwnerHomeQuery);

const createQueryResult = (overrides: Record<string, unknown> = {}) => {
  return {
    data: ownerHomeFixture,
    isError: false,
    isPending: false,
    refetch: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useOwnerHomeQuery>;
};

const renderHomeDashboardSection = () => {
  return render(
    <MemoryRouter>
      <HomeDashboardSection onCopyLinkResult={vi.fn()} onQrCodePreparing={vi.fn()} />
    </MemoryRouter>,
  );
};

describe('HomeDashboardSection', () => {
  it('renders product and flyer data returned by the owner home query', () => {
    mockedUseOwnerHomeQuery.mockReturnValue(createQueryResult());

    renderHomeDashboardSection();

    expect(screen.getAllByLabelText('총 1건')).toHaveLength(2);
    expect(screen.getByText('삼겹살 500g')).toBeInTheDocument();
    expect(screen.getByText('깻잎 2묶음')).toBeInTheDocument();
    expect(screen.getByText('app.dongchiimi.com/markets/mangwon-fresh')).toBeInTheDocument();
  });

  it('renders an accessible loading state while the owner home query is pending', () => {
    mockedUseOwnerHomeQuery.mockReturnValue(
      createQueryResult({
        data: undefined,
        isPending: true,
      }),
    );

    renderHomeDashboardSection();

    expect(screen.getByRole('status')).toHaveTextContent('홈 정보를 불러오는 중입니다.');
  });

  it('renders a retry action when the owner home query fails', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    mockedUseOwnerHomeQuery.mockReturnValue(
      createQueryResult({
        data: undefined,
        isError: true,
        refetch,
      }),
    );

    renderHomeDashboardSection();

    expect(screen.getByRole('alert')).toHaveTextContent('홈 정보를 불러오지 못했어요.');
    await user.click(screen.getByRole('button', { name: '다시 불러오기' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('applies product and flyer empty states from the owner home response', () => {
    mockedUseOwnerHomeQuery.mockReturnValue(
      createQueryResult({
        data: {
          ...ownerHomeFixture,
          dailyCount: 0,
          dailyProducts: [],
          periodicCount: 0,
          periodicProducts: [],
          flyer: null,
        },
      }),
    );

    renderHomeDashboardSection();

    expect(screen.getAllByText(/등록한 상품이 없어요\.\s*상품을 먼저 등록해주세요\./)).toHaveLength(
      2,
    );
    expect(screen.getByText(/전단을 공유하려면\s*상품을 먼저 등록해주세요\./)).toBeInTheDocument();
  });
});
