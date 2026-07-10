import { MemoryRouter } from 'react-router';
import { within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '@/test';

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

  return render(
    <MemoryRouter>
      <HomeProductSummarySection sections={sections} />
    </MemoryRouter>,
  );
};

describe('HomeProductSummarySection', () => {
  it('renders both product cards with their registered product counts', () => {
    renderHomeProductSummarySection();

    expect(screen.getByRole('heading', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 할인 상품' })).toBeInTheDocument();
    expect(screen.getByLabelText('총 20건')).toBeInTheDocument();
    expect(screen.getByLabelText('총 35건')).toBeInTheDocument();
  });

  it('dims only the today-special card and disables its product actions when its count is zero', () => {
    renderHomeProductSummarySection(['daily']);

    const todayCard = screen.getByRole('region', { name: '오늘의 특가 상품' });
    const periodicCard = screen.getByRole('region', { name: '행사 할인 상품' });

    expect(within(todayCard).getByLabelText('총 0건')).toBeInTheDocument();
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
