import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/test';

import {
  ProductHeaderSearch,
  type ProductHeaderSearchProductTypes,
  type ProductHeaderSearchProps,
} from './ProductHeaderSearch';

const products = [
  {
    dealType: 'DAILY',
    name: '딸기 2팩',
    productId: 101,
  },
  {
    dealType: 'PERIODIC',
    name: '햇감자 1kg',
    productId: 201,
  },
] satisfies ProductHeaderSearchProductTypes[];

const defaultProps = {
  onSelectProduct: vi.fn(),
  products,
} satisfies ProductHeaderSearchProps;

const renderProductHeaderSearch = (props: Partial<ProductHeaderSearchProps> = {}) => {
  return render(<ProductHeaderSearch {...defaultProps} {...props} />);
};

describe('ProductHeaderSearch', () => {
  it('forwards the selected product to the call site', async () => {
    const handleSelectProduct = vi.fn();
    const user = userEvent.setup();

    renderProductHeaderSearch({ onSelectProduct: handleSelectProduct });

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '햇감자');
    await user.click(await screen.findByRole('button', { name: /햇감자 1kg/ }));

    expect(handleSelectProduct).toHaveBeenCalledWith(products[1]);
  });

  it('matches the query against the product name only', async () => {
    const user = userEvent.setup();

    renderProductHeaderSearch();

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '행사 할인');

    expect(await screen.findByText('검색 결과가 없어요. 상품을 등록해보세요.')).toBeInTheDocument();
  });
});
