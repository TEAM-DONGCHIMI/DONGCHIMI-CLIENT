import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, within } from '../../../../test';
import {
  ProductSearchPanel,
  type ProductSearchPanelItemTypes,
  type ProductSearchPanelProps,
} from './ProductSearchPanel';

const products = [
  {
    id: 'today-tofu',
    label: '오늘의 특가',
    name: '풀무원 두부 1팩',
    registeredAt: '2026-07-08T08:00:00.000Z',
  },
  {
    id: 'today-bean-sprout',
    label: '오늘의 특가',
    name: '풀무원 콩나물 100g',
    registeredAt: '2026-07-08T07:00:00.000Z',
  },
  {
    id: 'event-grass',
    label: '행사 할인',
    name: '풀숲',
    registeredAt: '2026-07-08T06:00:00.000Z',
  },
  {
    id: 'event-pool',
    label: '행사 할인',
    name: '풀풀풀',
    registeredAt: '2026-07-08T05:00:00.000Z',
  },
] satisfies ProductSearchPanelItemTypes[];

const defaultProps = {
  items: products,
  onSelectProduct: vi.fn(),
} satisfies ProductSearchPanelProps;

const renderPanel = (props: Partial<ProductSearchPanelProps> = {}) => {
  return render(<ProductSearchPanel {...defaultProps} {...props} />);
};

describe('ProductSearchPanel', () => {
  it('opens the dropdown after one or more characters and sorts by match score then latest registration', async () => {
    const user = userEvent.setup();

    renderPanel();

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '풀');

    const resultList = screen.getByRole('list', { name: '상품 검색 결과' });
    const resultButtons = within(resultList).getAllByRole('button');

    expect(resultButtons).toHaveLength(4);
    expect(resultList).not.toHaveAttribute('data-scrollable');
    expect(resultButtons[0]).toHaveTextContent('풀무원 두부 1팩');
    expect(resultButtons[1]).toHaveTextContent('풀무원 콩나물 100g');
  });

  it('renders at most 10 results', async () => {
    const user = userEvent.setup();
    const manyProducts = Array.from({ length: 12 }, (_, index) => ({
      id: `product-${index}`,
      label: '오늘의 특가',
      name: `풀무원 상품 ${index}`,
      registeredAt: `2026-07-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
    }));

    renderPanel({ items: manyProducts });

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '풀무원');

    const resultList = screen.getByRole('list', { name: '상품 검색 결과' });

    expect(resultList).toHaveAttribute('data-scrollable', 'true');
    expect(within(resultList).getAllByRole('button')).toHaveLength(10);
  });

  it('calls onSelectProduct when a result is clicked', async () => {
    const handleSelectProduct = vi.fn();
    const user = userEvent.setup();

    renderPanel({ onSelectProduct: handleSelectProduct });

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '두부');
    await user.click(screen.getByRole('button', { name: /풀무원 두부 1팩/ }));

    expect(handleSelectProduct).toHaveBeenCalledWith(products[0]);
  });

  it('closes the dropdown when the outside area is clicked', async () => {
    const user = userEvent.setup();

    render(
      <>
        <ProductSearchPanel {...defaultProps} />
        <button type='button'>외부 영역</button>
      </>,
    );

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '풀');
    expect(screen.getByRole('list', { name: '상품 검색 결과' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '외부 영역' }));

    expect(screen.queryByRole('list', { name: '상품 검색 결과' })).not.toBeInTheDocument();
  });

  it('renders empty feedback when no products match', async () => {
    const user = userEvent.setup();

    renderPanel();

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '감자');

    expect(screen.getByRole('status')).toHaveTextContent(
      '검색 결과가 없어요. 상품을 등록해보세요.',
    );
  });

  it('renders error feedback when status is error', async () => {
    const user = userEvent.setup();

    renderPanel({ status: 'error' });

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '풀');

    expect(screen.getByRole('alert')).toHaveTextContent('상품 정보를 불러오지 못했어요.');
  });
});
