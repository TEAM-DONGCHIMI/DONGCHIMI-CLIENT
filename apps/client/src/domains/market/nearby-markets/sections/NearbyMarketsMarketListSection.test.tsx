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
    products,
  }: {
    martName: string;
    onActionClick?: () => void;
    products?: { productName: string }[];
  }) => (
    <article>
      <button onClick={onActionClick} type='button'>
        {martName}
      </button>
      <ul>
        {products?.map((product) => (
          <li key={product.productName}>{product.productName}</li>
        ))}
      </ul>
    </article>
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

  it('마트 상품 카드는 응답 순서를 유지해 최대 3개만 표시한다', () => {
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
          previewProducts: [
            {
              discountRate: 10,
              discountedPrice: 900,
              name: '먼저 등록한 상품',
              originalPrice: 1000,
              productId: 1,
              thumbnailUrl: null,
            },
            {
              discountRate: 0,
              discountedPrice: 2000,
              name: '두번째 등록한 상품',
              originalPrice: 2000,
              productId: 2,
              thumbnailUrl: null,
            },
            {
              discountRate: 5,
              discountedPrice: 2850,
              name: '세번째 등록한 상품',
              originalPrice: 3000,
              productId: 3,
              thumbnailUrl: null,
            },
            {
              discountRate: 20,
              discountedPrice: 3200,
              name: '네번째 등록한 상품',
              originalPrice: 4000,
              productId: 4,
              thumbnailUrl: null,
            },
          ],
          productCount: 4,
          slug: 'mangwon-fresh',
          thumbnailUrl: null,
        },
      ],
    });

    render(<NearbyMarketsMarketListSection />);

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '먼저 등록한 상품',
      '두번째 등록한 상품',
      '세번째 등록한 상품',
    ]);
    expect(screen.queryByText('네번째 등록한 상품')).not.toBeInTheDocument();
  });

  it('등록된 마트가 없으면 APPJAM 빈 상태 이미지와 등록 마트 없음 문구를 표시한다', () => {
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

    expect(screen.getByRole('status')).toHaveTextContent('근처에 등록된 마트가 아직 없어요');
    expect(screen.getByRole('status').querySelector('img')).toBeInTheDocument();
  });

  it('검색 결과가 없으면 검색 결과 없음 문구를 표시한다', () => {
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

    expect(screen.getByRole('status')).toHaveTextContent('검색 결과가 없어요');
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

  it('list error renders the APPJAM empty image without leaking the raw error message', () => {
    useNearbyMarketsMarketList.mockReturnValue({
      error: new Error('network exploded'),
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isError: true,
      isFetchingNextPage: false,
      isPending: false,
      keyword: undefined,
      markets: [],
    });

    render(<NearbyMarketsMarketListSection />);

    expect(screen.getByRole('alert')).not.toHaveTextContent('network exploded');
    expect(screen.getByRole('alert').querySelector('img')).toBeInTheDocument();
  });
});
