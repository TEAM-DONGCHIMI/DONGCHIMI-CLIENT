import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/test';

import { NearbyMarketsMarketListSection } from './NearbyMarketsMarketListSection';

const router = vi.hoisted(() => ({
  push: vi.fn(),
}));
const useNearbyMarketsMarketList = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

vi.mock('@dongchimi/shared/toast', () => ({
  useToast: () => ({ error: vi.fn() }),
}));

vi.mock('@/shared/components', () => ({
  MartSummaryCard: ({
    martName,
    onActionClick,
  }: {
    martName: string;
    onActionClick?: () => void;
  }) => (
    <button onClick={onActionClick} type='button'>
      {martName}
    </button>
  ),
}));

vi.mock('@/shared/hooks', () => ({
  useIntersectionObserver: () => vi.fn(),
}));

vi.mock('../NearbyMarketsClientProvider', () => ({
  useNearbyMarketsMarketList,
}));

describe('NearbyMarketsMarketListSection', () => {
  beforeEach(() => {
    router.push.mockClear();
    useNearbyMarketsMarketList.mockReturnValue({
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isError: false,
      isFetchingNextPage: false,
      isPending: false,
      keyword: undefined,
      markets: [
        {
          isOpen: true,
          marketId: 1,
          name: '망원 신선마트',
          previewProducts: [],
          productCount: 3,
          slug: 'mangwon-fresh',
          thumbnailUrl: 'https://cdn.example.com/markets/1.png',
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('전단보기 action은 마트 ID가 아닌 slug route로 이동한다', async () => {
    const user = userEvent.setup();

    render(<NearbyMarketsMarketListSection />);

    await user.click(screen.getByRole('button', { name: '망원 신선마트' }));

    expect(router.push).toHaveBeenCalledWith('/markets/mangwon-fresh');
  });

  it('등록된 마트가 없으면 APPJAM 빈 상태 이미지와 안내 문구를 표시한다', () => {
    useNearbyMarketsMarketList.mockReturnValue({
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isError: false,
      isFetchingNextPage: false,
      isPending: false,
      keyword: undefined,
      markets: [],
    });

    render(<NearbyMarketsMarketListSection />);

    expect(screen.getByRole('status')).toHaveTextContent(
      '주변에 제휴 마트가 없어요. 더 많은 마트를 만나보실 수 있도록 준비중이에요!',
    );
    expect(screen.getByRole('status').querySelector('img')).toBeInTheDocument();
  });

  it('검색 결과가 없으면 기존 검색 결과 없음 문구를 표시한다', () => {
    useNearbyMarketsMarketList.mockReturnValue({
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isError: false,
      isFetchingNextPage: false,
      isPending: false,
      keyword: '망원',
      markets: [],
    });

    render(<NearbyMarketsMarketListSection />);

    expect(screen.getByRole('status')).toHaveTextContent("'망원'에 대한 검색 결과가 없어요");
    expect(screen.getByRole('status').querySelector('img')).not.toBeInTheDocument();
  });

  it('노출 가능한 마트를 더 불러오는 중이면 빈 상태 대신 로딩 상태를 표시한다', () => {
    useNearbyMarketsMarketList.mockReturnValue({
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isError: false,
      isFetchingNextPage: true,
      isPending: false,
      keyword: undefined,
      markets: [],
    });

    render(<NearbyMarketsMarketListSection />);

    expect(screen.getByRole('status')).toHaveTextContent('마트를 더 불러오는 중이에요.');
    expect(screen.getByRole('status').querySelector('img')).not.toBeInTheDocument();
  });
});
