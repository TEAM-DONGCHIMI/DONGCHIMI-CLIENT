import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders, screen, userEvent, within } from '@/test';

import { MarketProductsPage } from './MarketProductsPage';
import { calculateFirstRowCategoryCount } from './sections/EventDiscountProductsSection';

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

const mockClipboardWriteText = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText,
    },
  });
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

  it('shows a bottom-center toast when leaflet link copy succeeds', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    mockClipboardWriteText(writeText);
    renderMarketProductsPage();

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    const dialog = await screen.findByRole('dialog', { name: '전단 공유하기' });

    await user.click(within(dialog).getByRole('button', { name: '링크 복사' }));

    expect(writeText).toHaveBeenCalledWith('dongchimi.kr/mangwon-fresh');
    expect(await within(dialog).findByRole('status')).toHaveTextContent(
      '전단 링크가 복사되었습니다.',
    );
    expect(within(dialog).getByRole('region', { name: '토스트 알림' })).toBeInTheDocument();
  });

  it('shows a pending toast when kakao share is selected', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    await user.click(screen.getByRole('button', { name: '공유하기' }));

    const dialog = await screen.findByRole('dialog', { name: '전단 공유하기' });

    await user.click(within(dialog).getByRole('button', { name: '카카오톡으로 공유' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('아직 준비중인 기능이에요.');
    expect(within(dialog).getByRole('region', { name: '토스트 알림' })).toBeInTheDocument();
  });

  it('filters event discount products by category', async () => {
    const user = userEvent.setup();

    renderMarketProductsPage();

    const eventSection = getSectionQueries('행사 할인 상품');

    await user.click(eventSection.getByRole('button', { name: '정육·달걀' }));

    expect(eventSection.getAllByRole('link')).toHaveLength(3);
    expect(eventSection.queryByText('대추방울토마토 500G')).not.toBeInTheDocument();

    const moreButton = eventSection.getByRole('button', { name: '더보기' });

    expect(moreButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(moreButton);

    expect(moreButton).toHaveAttribute('aria-expanded', 'true');
    expect(eventSection.queryByRole('button', { name: '접기' })).not.toBeInTheDocument();

    await user.click(eventSection.getByRole('button', { name: '수산' }));

    expect(eventSection.getAllByRole('link')).toHaveLength(1);
    expect(eventSection.getByText('손질 고등어 1팩')).toBeInTheDocument();
  });
});

describe('calculateFirstRowCategoryCount', () => {
  it('returns every category count when all category chips fit without the more chip', () => {
    expect(
      calculateFirstRowCategoryCount({
        allCategoryWidth: 48,
        categoryWidths: [64, 80, 72],
        containerWidth: 280,
        gap: 4,
        moreCategoryWidth: 72,
      }),
    ).toBe(3);
  });

  it('reserves space for the more chip when categories overflow the first row', () => {
    expect(
      calculateFirstRowCategoryCount({
        allCategoryWidth: 48,
        categoryWidths: [64, 80, 72],
        containerWidth: 220,
        gap: 4,
        moreCategoryWidth: 72,
      }),
    ).toBe(1);
  });
});
