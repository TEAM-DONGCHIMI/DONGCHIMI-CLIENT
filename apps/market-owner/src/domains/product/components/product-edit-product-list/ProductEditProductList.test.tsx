import { MemoryRouter, Route, Routes } from 'react-router';
import { fireEvent, waitFor } from '@testing-library/react';
import { OverlayProvider } from 'overlay-kit';
import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/test';

import { ProductEditProductList } from './ProductEditProductList';
import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
  type ProductEditProductGroup,
} from './display-groups';

const renderProductList = (
  groups: ProductEditProductGroup[] = [],
  editModalVariant: ProductEditCardVariantTypes = 'todaySpecial',
  onDeleteProduct?: (product: ProductEditCardProps) => void,
) => {
  return render(
    <MemoryRouter>
      <OverlayProvider>
        <Routes>
          <Route
            element={
              <ProductEditProductList
                ariaLabel='오늘의 특가 상품 수정 목록'
                editModalVariant={editModalVariant}
                groups={groups}
                registrationHref='/products/today-special/new'
                onDeleteProduct={onDeleteProduct}
              />
            }
            path='/'
          />
          <Route element={<p>오늘의 특가 상품 등록 화면</p>} path='/products/today-special/new' />
        </Routes>
      </OverlayProvider>
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

  it('renders selectable cards and disables card actions in bulk selection mode', async () => {
    const user = userEvent.setup();
    const handleToggleProductSelection = vi.fn();

    render(
      <MemoryRouter>
        <OverlayProvider>
          <ProductEditProductList
            ariaLabel='오늘의 특가 상품 수정 목록'
            editModalVariant='todaySpecial'
            groups={[
              {
                title: '2026년 8월 15일',
                products: [
                  {
                    categoryName: '채소·과일',
                    endDate: '2026. 8. 16',
                    originalPrice: '5,000',
                    productName: '딸기 2팩',
                    salePrice: '4,500',
                    viewCount: 162,
                  },
                ],
              },
            ]}
            registrationHref='/products/today-special/new'
            selectedProductNames={['딸기 2팩']}
            selectionMode
            onToggleProductSelection={handleToggleProductSelection}
          />
        </OverlayProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: '딸기 2팩 상품 수정' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '딸기 2팩 상품 삭제' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '딸기 2팩 상품 선택' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: '딸기 2팩 상품 선택' }));

    expect(handleToggleProductSelection).toHaveBeenCalledWith(
      expect.objectContaining({ productName: '딸기 2팩' }),
    );
  });

  it('opens today special edit modal from product card edit action', async () => {
    const user = userEvent.setup();

    renderProductList([
      {
        title: '2026년 8월 15일',
        products: [
          {
            categoryName: '채소·과일',
            endDate: '2026. 8. 16',
            originalPrice: '5,000',
            productName: '딸기 2팩',
            salePrice: '4,500',
            viewCount: 162,
          },
        ],
      },
    ]);

    await user.click(screen.getByRole('button', { name: '딸기 2팩 상품 수정' }));

    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole('heading', { name: '판매 정보를 수정해주세요' }),
      );
    });
    expect(screen.getByLabelText('상품명')).toHaveValue('딸기 2팩');
    expect(screen.getByLabelText('오늘의 특가')).toHaveValue('4,500');
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '하루 더 늘리기' }));

    expect(screen.getByRole('dialog', { name: '판매 정보를 수정해주세요' })).toBeInTheDocument();
    expect(screen.getByLabelText('행사 종료일')).toHaveValue('2026-08-17');
    expect(screen.getByRole('button', { name: '오늘만 특가로' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '오늘만 특가로' }));

    expect(screen.getByRole('dialog', { name: '판매 정보를 수정해주세요' })).toBeInTheDocument();
    expect(screen.getByLabelText('행사 종료일')).toHaveValue('2026-08-16');
    expect(screen.getByRole('button', { name: '하루 더 늘리기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });

  it('updates category from edit modal category dropdown', async () => {
    const user = userEvent.setup();

    renderProductList(
      [
        {
          title: '채소·과일',
          products: [
            {
              categoryName: '채소·과일',
              endDate: '2026. 8. 16',
              productName: '햇감자 1kg',
              salePrice: '3,900',
              startDate: '2026. 8. 12',
              viewCount: 241,
            },
          ],
        },
      ],
      'eventDiscount',
    );

    await user.click(screen.getByRole('button', { name: '햇감자 1kg 상품 수정' }));

    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '채소·과일' }));

    expect(await screen.findByRole('group', { name: '상품 구분 선택' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '정육·달걀' }));

    expect(screen.getByRole('button', { name: '정육·달걀' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: '상품 구분 선택' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeEnabled();
  });

  it('keeps edit modal open when backdrop is pressed', async () => {
    const user = userEvent.setup();

    renderProductList([
      {
        title: '2026년 8월 15일',
        products: [
          {
            categoryName: '채소·과일',
            endDate: '2026. 8. 16',
            originalPrice: '5,000',
            productName: '딸기 2팩',
            salePrice: '4,500',
            viewCount: 162,
          },
        ],
      },
    ]);

    await user.click(screen.getByRole('button', { name: '딸기 2팩 상품 수정' }));

    const dialog = await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' });

    fireEvent.mouseDown(dialog, { clientX: -1, clientY: -1 });

    expect(screen.getByRole('dialog', { name: '판매 정보를 수정해주세요' })).toBeInTheDocument();
  });

  it('opens event discount edit modal from product card edit action', async () => {
    const user = userEvent.setup();

    renderProductList(
      [
        {
          title: '채소·과일',
          products: [
            {
              categoryName: '채소·과일',
              endDate: '2026. 8. 16',
              productName: '햇감자 1kg',
              salePrice: '3,900',
              startDate: '2026. 8. 12',
              viewCount: 241,
            },
          ],
        },
      ],
      'eventDiscount',
    );

    await user.click(screen.getByRole('button', { name: '햇감자 1kg 상품 수정' }));

    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('상품명')).toHaveValue('햇감자 1kg');
    expect(screen.getByLabelText('판매가')).toHaveValue('3,900');
    expect(screen.queryByRole('button', { name: '하루 더 늘리기' })).not.toBeInTheDocument();
  });

  it('deletes product after confirming delete when promotion period remains', async () => {
    const user = userEvent.setup();
    const deletedProducts: string[] = [];

    renderProductList(
      [
        {
          title: '2026년 8월 15일',
          products: [
            {
              categoryName: '채소·과일',
              endDate: '2026. 8. 16',
              originalPrice: '5,000',
              productName: '딸기 2팩',
              salePrice: '4,500',
              viewCount: 162,
            },
          ],
        },
      ],
      'todaySpecial',
      (product) => deletedProducts.push(product.productName),
    );

    await user.click(screen.getByRole('button', { name: '딸기 2팩 상품 삭제' }));

    expect(
      await screen.findByRole('dialog', {
        name: /행사 기간이 아직 남았어요\.\s*정말 삭제하시겠어요\?/,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '삭제하기' }));

    expect(deletedProducts).toEqual(['딸기 2팩']);
  });

  it('deletes product immediately when promotion period has ended', async () => {
    const user = userEvent.setup();
    const deletedProducts: string[] = [];

    renderProductList(
      [
        {
          title: '2020년 8월 15일',
          products: [
            {
              categoryName: '채소·과일',
              endDate: '2020. 8. 16',
              originalPrice: '5,000',
              productName: '지난 딸기 2팩',
              salePrice: '4,500',
              viewCount: 162,
            },
          ],
        },
      ],
      'todaySpecial',
      (product) => deletedProducts.push(product.productName),
    );

    await user.click(screen.getByRole('button', { name: '지난 딸기 2팩 상품 삭제' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(deletedProducts).toEqual(['지난 딸기 2팩']);
  });
});
