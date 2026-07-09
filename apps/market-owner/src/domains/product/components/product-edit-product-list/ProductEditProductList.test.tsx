import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';

import { render, screen, userEvent } from '@/test';

import { ProductEditProductList } from './ProductEditProductList';

const renderProductList = () => {
  return render(
    <MemoryRouter>
      <Routes>
        <Route
          element={
            <ProductEditProductList
              ariaLabel='오늘의 특가 상품 수정 목록'
              groups={[]}
              registrationHref='/products/today-special/new'
            />
          }
          path='/'
        />
        <Route element={<p>오늘의 특가 상품 등록 화면</p>} path='/products/today-special/new' />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ProductEditProductList', () => {
  it('renders empty state with registration button when no products are available', async () => {
    const user = userEvent.setup();

    renderProductList();

    expect(screen.getByRole('region', { name: '오늘의 특가 상품 수정 목록' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '등록된 상품이 존재하지 않아요!' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('상품을 추가 등록해 오늘의 알찬 전단을 만들어보세요.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '상품 등록하러 가기' }));

    expect(screen.getByText('오늘의 특가 상품 등록 화면')).toBeInTheDocument();
  });
});
