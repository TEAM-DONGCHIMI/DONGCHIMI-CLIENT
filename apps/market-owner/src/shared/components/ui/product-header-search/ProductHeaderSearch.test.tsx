import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, waitFor } from '@/test';

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

  it('passes the trimmed query to the API call site after debounce', async () => {
    const handleQueryChange = vi.fn();
    const user = userEvent.setup();

    renderProductHeaderSearch({ onQueryChange: handleQueryChange });

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '  햇감자  ');

    await waitFor(() => expect(handleQueryChange).toHaveBeenLastCalledWith('햇감자'));
  });

  it('shows the API error state without filtering results locally', async () => {
    const user = userEvent.setup();

    renderProductHeaderSearch({ products: [], status: 'error' });

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '행사 할인');

    expect(await screen.findByRole('alert')).toHaveTextContent('상품 정보를 불러오지 못했어요.');
  });
});
