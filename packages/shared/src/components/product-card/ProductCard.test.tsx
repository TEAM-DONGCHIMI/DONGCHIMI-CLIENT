import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../test';
import { ProductCard } from './ProductCard';
import { productCardItemsFixture } from './ProductCard.fixtures';

describe('ProductCard', () => {
  it('renders title, total count, and initial visible items', () => {
    render(
      <ProductCard
        initialVisibleCount={2}
        items={productCardItemsFixture}
        onProductClick={vi.fn()}
        title='오늘의 특가 상품'
        totalCount={30}
      />,
    );

    expect(screen.getByRole('region', { name: '오늘의 특가 상품' })).toBeInTheDocument();
    expect(screen.getByText('30건')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('toggles hidden items with accessible expanded state', async () => {
    const user = userEvent.setup();

    render(
      <ProductCard
        initialVisibleCount={2}
        items={productCardItemsFixture}
        onProductClick={vi.fn()}
        title='오늘의 특가 상품'
      />,
    );

    const toggleButton = screen.getByRole('button', { name: '더 많은 상품 보기' });

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggleButton);

    expect(screen.getAllByRole('listitem')).toHaveLength(productCardItemsFixture.length);
    expect(screen.getByRole('button', { name: '상품 접기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('calls onProductClick when a product item is selected', async () => {
    const handleProductClick = vi.fn();
    const user = userEvent.setup();

    render(
      <ProductCard
        initialVisibleCount={2}
        items={productCardItemsFixture}
        onProductClick={handleProductClick}
        title='오늘의 특가 상품'
      />,
    );

    await user.click(
      screen.getByRole('button', { name: '상품 보기: 풀무원 콩나물 500g 1, 10% 할인' }),
    );

    expect(handleProductClick).toHaveBeenCalledTimes(1);
    expect(handleProductClick).toHaveBeenCalledWith(productCardItemsFixture[0], 0);
  });

  it('renders period item variant with ranking', () => {
    render(
      <ProductCard
        initialVisibleCount={2}
        itemVariant='period'
        items={productCardItemsFixture}
        onProductClick={vi.fn()}
        title='기간 할인 상품'
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders empty state without expand control', () => {
    render(
      <ProductCard
        emptyMessage='등록된 상품이 없습니다.'
        items={[]}
        onProductClick={vi.fn()}
        title='등록된 상품'
      />,
    );

    expect(screen.getByText('등록된 상품이 없습니다.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '더 많은 상품 보기' })).toBeNull();
  });

  it('does not render an empty surface when an empty message is explicitly omitted', () => {
    render(<ProductCard emptyMessage='' items={[]} onProductClick={vi.fn()} title='등록된 상품' />);

    expect(screen.getByRole('region', { name: '등록된 상품' }).querySelector('p')).toBeNull();
  });
});
