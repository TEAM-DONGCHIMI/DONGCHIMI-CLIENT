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
});
