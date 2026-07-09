import { RouterProvider, createMemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test';
import { AppProviders } from './AppProviders';
import { marketOwnerRoutes } from './router';

const renderRoute = (path: string) => {
  const router = createMemoryRouter(marketOwnerRoutes, {
    initialEntries: [path],
  });

  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
};

const mockClipboardWriteText = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText,
    },
  });
};

describe('marketOwnerRoutes', () => {
  it('renders public auth routes without the sidebar layout', async () => {
    renderRoute('/login');

    expect(await screen.findByRole('heading', { name: '로그인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('renders protected work routes with the sidebar layout', async () => {
    renderRoute('/');

    expect(await screen.findByRole('heading', { name: '동치미 홈' })).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('search', { name: '상품 검색' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /오늘의 특가 상품 등록하기/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /행사 할인 상품 등록하기/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /상품 수정하러 가기/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 할인 상품' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '등록한 상품 전체보기' })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: '전단 공유하기' })).toBeInTheDocument();
    expect(screen.getByText('dongchimi.kr/mangwon-fresh')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '링크 복사' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '매장 고유 QR코드 보기' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '오늘의 전단 공유' })).not.toBeInTheDocument();
  });

  it('navigates the today-special summary action to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '등록한 상품 전체보기' })[0]);

    expect(
      await screen.findByRole('heading', { name: '오늘의 특가 상품 수정' }),
    ).toBeInTheDocument();
  });

  it('navigates a today-special product row to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '상품 보기: 풀무원 콩나물 500g' })[0]);

    expect(
      await screen.findByRole('heading', { name: '오늘의 특가 상품 수정' }),
    ).toBeInTheDocument();
  });

  it('navigates the event-discount summary action to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getAllByRole('button', { name: '등록한 상품 전체보기' })[1]);

    expect(await screen.findByRole('heading', { name: '행사 할인 상품 수정' })).toBeInTheDocument();
  });

  it('navigates an event-discount product row to the edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '1위 상품 보기: 풀무원 콩나물 500g' }));

    expect(await screen.findByRole('heading', { name: '행사 할인 상품 수정' })).toBeInTheDocument();
  });

  it('shows a completed toast when leaflet link copy succeeds', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    mockClipboardWriteText(writeText);
    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '링크 복사' }));

    expect(writeText).toHaveBeenCalledWith('dongchimi.kr/mangwon-fresh');
    expect(await screen.findByRole('status')).toHaveTextContent('전단 링크가 복사되었습니다.');
    expect(screen.getByRole('region', { name: '토스트 알림' })).toHaveStyle({
      '--toast-viewport-center-offset-x': '145px',
      '--toast-viewport-offset-y': '2rem',
    });
  });

  it('shows an error toast when leaflet link copy fails', async () => {
    const user = userEvent.setup();

    mockClipboardWriteText(vi.fn().mockRejectedValue(new Error('copy failed')));
    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '링크 복사' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '링크를 복사하지 못했습니다. 다시 시도해주세요.',
    );
  });

  it('shows a preparing toast when leaflet QR code action is clicked', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: '매장 고유 QR코드 보기' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'QR코드 보기 기능은 준비 중입니다.',
    );
  });

  it('navigates a loaded search result to the product edit page', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '콩나물 100g');
    await user.click(await screen.findByRole('button', { name: /풀무원 콩나물 100g/ }));

    expect(
      await screen.findByRole('heading', { name: '오늘의 특가 상품 수정' }),
    ).toBeInTheDocument();
  });

  it('shows pending feedback before debounced search results are applied', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '풀');

    expect(screen.getByRole('status')).toHaveTextContent('검색 중...');
    expect(screen.queryByText('검색 결과가 없어요. 상품을 등록해보세요.')).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /풀무원 두부 1팩/ })).toBeInTheDocument();
  });

  it('shows an error toast when selected search product info cannot be loaded', async () => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '두부 1팩');
    await user.click(await screen.findByRole('button', { name: /풀무원 두부 1팩/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('상품 정보를 불러오지 못했어요.');
    expect(screen.getByRole('heading', { name: '동치미 홈' })).toBeInTheDocument();
  });

  it.each([
    ['오늘의 특가 상품 등록하기', '오늘의 특가 상품 등록'],
    ['행사 할인 상품 등록하기', '등록한 파일을 확인해주세요'],
    ['상품 수정하러 가기', '오늘의 특가 상품 수정'],
  ])('navigates the %s hero action to its work page', async (buttonName, headingName) => {
    const user = userEvent.setup();

    renderRoute('/');

    await screen.findByRole('heading', { name: '동치미 홈' });
    await user.click(screen.getByRole('button', { name: new RegExp(buttonName) }));

    expect(await screen.findByRole('heading', { name: headingName })).toBeInTheDocument();
  });

  it('keeps the registration result route outside the sidebar layout', async () => {
    renderRoute('/products/registration-result');

    expect(await screen.findByRole('heading', { name: '상품 등록 결과 확인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('syncs edit sidebar and tab navigation through route state', async () => {
    renderRoute('/products/event-discount/edit');

    expect(await screen.findByRole('heading', { name: '행사 할인 상품 수정' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인 상품 수정' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('navigation', { name: '상품 수정 유형' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders the not found page for unknown routes', async () => {
    renderRoute('/unknown-route');

    expect(
      await screen.findByRole('heading', { name: '페이지를 찾을 수 없습니다.' }),
    ).toBeInTheDocument();
  });
});
