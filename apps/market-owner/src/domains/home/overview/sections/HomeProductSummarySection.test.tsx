import { RouterProvider, createMemoryRouter } from 'react-router';
import { within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { render, screen, userEvent } from '@/test';

import { homeProductSections } from '../fixtures';

import { HomeProductSummarySection } from './HomeProductSummarySection';

const EMPTY_PRODUCT_MESSAGE_PATTERN = /등록한 상품이 없어요\.\s*상품을 먼저 등록해주세요\./;
const registeredProductCounts: Record<string, number> = {
  daily: 20,
  periodic: 35,
};

const renderHomeProductSummarySection = (emptySectionIds: readonly string[] = []) => {
  const sections = homeProductSections.map((section) => ({
    ...section,
    totalCount: emptySectionIds.includes(section.id)
      ? 0
      : (registeredProductCounts[section.id] ?? section.totalCount),
  }));

  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: <HomeProductSummarySection sections={sections} />,
      },
    ],
    { initialEntries: ['/'] },
  );

  render(<RouterProvider router={router} />);

  return router;
};

describe('HomeProductSummarySection', () => {
  it('renders both product cards with their registered product counts', () => {
    renderHomeProductSummarySection();

    expect(screen.getByRole('heading', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 할인 상품' })).toBeInTheDocument();
    expect(screen.getByLabelText('총 20건')).toBeInTheDocument();
    expect(screen.getByLabelText('총 35건')).toBeInTheDocument();
  });

  it.each([
    {
      expectedPathname: '/products/today-special/edit',
      expectedSearch: '?productId=101',
      productName: '상품 보기: 풀무원 콩나물 500g, 10% 할인',
      sectionName: '오늘의 특가 상품',
    },
    {
      expectedPathname: '/products/event-discount/edit',
      expectedSearch: '?productId=201',
      productName: '1위 상품 보기: 풀무원 콩나물 500g',
      sectionName: '행사 할인 상품',
    },
  ])(
    '$sectionName 상품 선택 시 productId와 함께 해당 수정 페이지로 이동한다',
    async ({ expectedPathname, expectedSearch, productName, sectionName }) => {
      const user = userEvent.setup();
      const router = renderHomeProductSummarySection();
      const productSection = screen.getByRole('region', { name: sectionName });

      await user.click(within(productSection).getAllByRole('button', { name: productName })[0]);

      expect(router.state.location.pathname).toBe(expectedPathname);
      expect(router.state.location.search).toBe(expectedSearch);
    },
  );

  it('dims only the today-special card and disables its product actions when its count is zero', () => {
    renderHomeProductSummarySection(['daily']);

    const todayCard = screen.getByRole('region', { name: '오늘의 특가 상품' });
    const periodicCard = screen.getByRole('region', { name: '행사 할인 상품' });

    expect(within(todayCard).getByLabelText('총 0건')).toBeInTheDocument();
    expect(todayCard).toHaveAttribute('aria-describedby', 'daily-empty-message');
    expect(periodicCard).not.toHaveAttribute('aria-describedby');
    expect(screen.getByText(EMPTY_PRODUCT_MESSAGE_PATTERN)).toBeInTheDocument();
    expect(within(todayCard).getByRole('button', { name: '등록한 상품 전체보기' })).toBeDisabled();
    expect(
      within(todayCard).queryByRole('button', { name: '상품 보기: 풀무원 콩나물 500g' }),
    ).not.toBeInTheDocument();
    expect(
      within(periodicCard).getByRole('button', { name: '등록한 상품 전체보기' }),
    ).toBeEnabled();
  });

  it('dims only the event-discount card when its count is zero', () => {
    renderHomeProductSummarySection(['periodic']);

    const periodicCard = screen.getByRole('region', { name: '행사 할인 상품' });

    expect(within(periodicCard).getByLabelText('총 0건')).toBeInTheDocument();
    expect(periodicCard).toHaveAttribute('aria-describedby', 'periodic-empty-message');
    expect(screen.getByText(EMPTY_PRODUCT_MESSAGE_PATTERN)).toBeInTheDocument();
    expect(
      within(periodicCard).getByRole('button', { name: '등록한 상품 전체보기' }),
    ).toBeDisabled();
    expect(
      within(periodicCard).queryByRole('button', {
        name: '1위 상품 보기: 풀무원 콩나물 500g',
      }),
    ).not.toBeInTheDocument();
  });

  it('dims both product cards when both product counts are zero', () => {
    renderHomeProductSummarySection(['daily', 'periodic']);

    expect(screen.getAllByText(EMPTY_PRODUCT_MESSAGE_PATTERN)).toHaveLength(2);

    screen
      .getAllByRole('button', { name: '등록한 상품 전체보기' })
      .forEach((button) => expect(button).toBeDisabled());
  });
});
