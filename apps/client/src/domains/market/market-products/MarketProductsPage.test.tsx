import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders, screen, userEvent, within } from '@/test';

import { MarketProductsPage } from './MarketProductsPage';

const router = {
  back: vi.fn(),
  push: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

const renderMarketProductsPage = () => {
  return renderWithProviders(<MarketProductsPage marketId='mangwon-fresh' />);
};

const getSectionQueries = (headingName: string) => {
  const section = screen.getByRole('heading', { name: headingName }).closest('section');

  expect(section).not.toBeNull();

  return within(section as HTMLElement);
};

describe('MarketProductsPage', () => {
  beforeEach(() => {
    router.back.mockClear();
    router.push.mockClear();
  });

  it('renders market leaflet sections', () => {
    renderMarketProductsPage();

    expect(screen.getByRole('heading', { name: '전단보기' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '망원 신선마트' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '지금 가장 인기 있는 상품 TOP 3' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 할인 상품' })).toBeInTheDocument();
  });

  it('opens the call confirmation modal', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    await user.click(screen.getByRole('button', { name: '전화걸기' }));

    const dialog = await screen.findByRole('dialog', { name: '망원 신선마트에 전화할까요?' });

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('02-123-4567')).toBeInTheDocument();
  });

  it('toggles today special products', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    const todaySection = getSectionQueries('오늘의 특가 상품');

    expect(todaySection.getAllByRole('link')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: '등록한 상품 전체보기' }));

    expect(todaySection.getAllByRole('link')).toHaveLength(9);

    await user.click(screen.getByRole('button', { name: '접기' }));

    expect(todaySection.getAllByRole('link')).toHaveLength(2);
  });

  it('filters event discount products by category', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    await user.click(eventSection.getByRole('button', { name: '정육·달걀' }));

    expect(eventSection.getAllByRole('link')).toHaveLength(3);
    expect(eventSection.queryByText('대추방울토마토 500G')).not.toBeInTheDocument();

    await user.click(eventSection.getByRole('button', { name: '더보기' }));
    await user.click(eventSection.getByRole('button', { name: '수산·건어물' }));

    expect(eventSection.getAllByRole('link')).toHaveLength(1);
    expect(eventSection.getByText('손질 고등어 1팩')).toBeInTheDocument();
  });
});
