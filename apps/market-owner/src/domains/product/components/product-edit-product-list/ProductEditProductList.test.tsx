import { MemoryRouter, Route, Routes } from 'react-router';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '@dongchimi/shared/toast';
import { OverlayProvider } from 'overlay-kit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/test';

import { ProductEditProductList } from './ProductEditProductList';
import { useProductEditListActions } from './use-product-edit-list-actions';
import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
  type ProductEditProductGroup,
} from './display-groups';

const mockUseProductDetailQuery = vi.hoisted(() => vi.fn());
const mockSubmitProductUpdate = vi.hoisted(() => vi.fn());
const mockUseProductUpdateFlow = vi.hoisted(() => vi.fn());
let intersectionObserverCallback: IntersectionObserverCallback | undefined;

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];

  constructor(callback: IntersectionObserverCallback) {
    intersectionObserverCallback = callback;
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

vi.mock('@/domains/product/hooks/use-product-detail-query', () => ({
  useProductDetailQuery: mockUseProductDetailQuery,
}));

vi.mock('@/domains/product/hooks/use-product-update-flow', () => ({
  useProductUpdateFlow: mockUseProductUpdateFlow,
}));

mockUseProductDetailQuery.mockImplementation(({ productId }: { productId: number }) => {
  const isEventDiscount = productId === 201 || productId === 202;
  const hasPastStartDate = productId === 202;
  let discountStartDate = '2026-08-16';

  if (hasPastStartDate) {
    discountStartDate = '2020-08-12';
  } else if (isEventDiscount) {
    discountStartDate = '2026-08-12';
  }

  return {
    data: {
      data: {
        productId,
        name: isEventDiscount ? '햇감자 1kg' : '딸기 2팩',
        dealType: isEventDiscount ? 'PERIODIC' : 'DAILY',
        thumbnailUrl: null,
        originalPrice: isEventDiscount ? 4500 : 5000,
        discountedPrice: isEventDiscount ? 3900 : 4500,
        category: 'VEGETABLE_FRUIT',
        categoryName: '채소/과일',
        promotionalPhrase: isEventDiscount ? '상세 조회 홍보글' : null,
        discountStartDate,
        discountEndDate: '2026-08-16',
      },
    },
    isError: false,
    isPending: false,
    refetch: vi.fn(),
  };
});

interface ProductEditProductListWithActionsProps {
  autoOpenProductId?: string | null;
  editModalVariant?: ProductEditCardVariantTypes;
  groups: ProductEditProductGroup[];
  selectionMode?: boolean;
  onAutoOpenProductMissing?: (productId: string) => void;
  onDeleteProduct?: (product: ProductEditCardProps) => void;
  onUpdateProduct?: (productId: number, product: ProductEditCardProps) => void;
}

const ProductEditProductListWithActions = ({
  autoOpenProductId,
  editModalVariant = 'todaySpecial',
  groups,
  selectionMode = false,
  onAutoOpenProductMissing,
  onDeleteProduct,
  onUpdateProduct,
}: ProductEditProductListWithActionsProps) => {
  const actions = useProductEditListActions({
    autoOpenProductId,
    groups,
    marketId: 1,
    variant: editModalVariant,
    onAutoOpenProductMissing,
    onDeleteProduct,
    onUpdateProduct,
  });

  return (
    <ProductEditProductList
      actions={actions}
      ariaLabel='오늘의 특가 상품 수정 목록'
      groups={groups}
      registrationHref='/products/today-special/new'
      selection={
        selectionMode
          ? { enabled: true, selectedProductIds: [], onToggleProduct: vi.fn() }
          : undefined
      }
    />
  );
};

const renderProductList = (
  groups: ProductEditProductGroup[] = [],
  editModalVariant: ProductEditCardVariantTypes = 'todaySpecial',
  onDeleteProduct?: (product: ProductEditCardProps) => void,
  onUpdateProduct?: (productId: number, product: ProductEditCardProps) => void,
) => {
  return render(
    <MemoryRouter>
      <ToastProvider defaultDurationMs={null}>
        <OverlayProvider>
          <Routes>
            <Route
              element={
                <ProductEditProductListWithActions
                  editModalVariant={editModalVariant}
                  groups={groups}
                  onDeleteProduct={onDeleteProduct}
                  onUpdateProduct={onUpdateProduct}
                />
              }
              path='/'
            />
            <Route element={<p>오늘의 특가 상품 등록 화면</p>} path='/products/today-special/new' />
          </Routes>
        </OverlayProvider>
      </ToastProvider>
    </MemoryRouter>,
  );
};

describe('ProductEditProductList', () => {
  beforeEach(() => {
    intersectionObserverCallback = undefined;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    mockUseProductDetailQuery.mockClear();
    mockSubmitProductUpdate.mockReset();
    mockSubmitProductUpdate.mockResolvedValue({ success: true, thumbnailUrl: null });
    mockUseProductUpdateFlow.mockReturnValue({
      isPending: false,
      submitProductUpdate: mockSubmitProductUpdate,
    });
  });

  it('loads the next page when the list sentinel enters the viewport', () => {
    const handleLoadNextPage = vi.fn();

    render(
      <MemoryRouter>
        <OverlayProvider>
          <ProductEditProductList
            actions={{}}
            ariaLabel='오늘의 특가 상품 수정 목록'
            groups={[
              {
                title: '2026년 8월 15일',
                products: [
                  {
                    productId: 101,
                    productName: '딸기 2팩',
                    salePrice: '4,500',
                  },
                ],
              },
            ]}
            pagination={{
              hasNextPage: true,
              status: 'idle',
              onLoadNextPage: handleLoadNextPage,
            }}
            registrationHref='/products/today-special/new'
          />
        </OverlayProvider>
      </MemoryRouter>,
    );

    act(() => {
      intersectionObserverCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(handleLoadNextPage).toHaveBeenCalledTimes(1);
  });

  it('keeps the list visible while loading or retrying the next page', async () => {
    const user = userEvent.setup();
    const handleLoadNextPage = vi.fn();
    const groups = [
      {
        title: '2026년 8월 15일',
        products: [{ productId: 101, productName: '딸기 2팩', salePrice: '4,500' }],
      },
    ];
    const { rerender } = render(
      <MemoryRouter>
        <OverlayProvider>
          <ProductEditProductList
            actions={{}}
            ariaLabel='오늘의 특가 상품 수정 목록'
            groups={groups}
            pagination={{
              hasNextPage: true,
              status: 'loading',
              onLoadNextPage: handleLoadNextPage,
            }}
            registrationHref='/products/today-special/new'
          />
        </OverlayProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('딸기 2팩')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('상품을 더 불러오는 중입니다.');

    rerender(
      <MemoryRouter>
        <OverlayProvider>
          <ProductEditProductList
            actions={{}}
            ariaLabel='오늘의 특가 상품 수정 목록'
            groups={groups}
            pagination={{
              hasNextPage: true,
              status: 'error',
              onLoadNextPage: handleLoadNextPage,
            }}
            registrationHref='/products/today-special/new'
          />
        </OverlayProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('딸기 2팩')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('상품을 더 불러오지 못했어요.');

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(handleLoadNextPage).toHaveBeenCalledTimes(1);
  });

  it('renders empty state with registration button when no products are available', async () => {
    const user = userEvent.setup();

    const { container } = renderProductList();

    expect(screen.getByRole('region', { name: '오늘의 특가 상품 수정 목록' })).toBeInTheDocument();
    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
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
            actions={{}}
            ariaLabel='오늘의 특가 상품 수정 목록'
            groups={[
              {
                title: '2026년 8월 15일',
                products: [
                  {
                    categoryName: '채소/과일',
                    endDate: '2026. 8. 16',
                    originalPrice: '5,000',
                    productId: 101,
                    productName: '딸기 2팩',
                    salePrice: '4,500',
                    viewCount: 162,
                  },
                ],
              },
            ]}
            registrationHref='/products/today-special/new'
            selection={{
              enabled: true,
              selectedProductIds: [101],
              onToggleProduct: handleToggleProductSelection,
            }}
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
            categoryName: '채소/과일',
            endDate: '2026. 8. 16',
            originalPrice: '5,000',
            productId: 101,
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
      expect(screen.getByRole('dialog')).toHaveFocus();
    });
    expect(screen.getByLabelText('상품명')).toHaveValue('딸기 2팩');
    expect(screen.getByLabelText('오늘의 특가')).toHaveValue('4,500');
    expect(screen.getByLabelText('행사 시작일')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('행사 종료일')).not.toHaveAttribute('readonly');
    expect(screen.getByLabelText('행사 시작일')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('행사 종료일')).toHaveAttribute('type', 'text');
    expect(mockUseProductDetailQuery).toHaveBeenCalledWith({ marketId: 1, productId: 101 });
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();

    await user.clear(screen.getByLabelText('상품명'));
    await user.type(screen.getByLabelText('상품명'), '12345 7890123456');
    await user.type(screen.getByLabelText('상품 한줄 홍보글'), '1234567890 1234567890 12345');

    expect(screen.getByLabelText('상품명')).toHaveValue('12345 789012345');
    expect(screen.getByLabelText('상품 한줄 홍보글')).toHaveValue('1234567890 1234567890 123');

    await user.clear(screen.getByLabelText('원가'));
    await user.type(screen.getByLabelText('원가'), '가격1234원');
    await user.clear(screen.getByLabelText('오늘의 특가'));
    await user.type(screen.getByLabelText('오늘의 특가'), '특가4500원');

    expect(screen.getByLabelText('원가')).toHaveValue('1,234');
    expect(screen.getByLabelText('오늘의 특가')).toHaveValue('4,500');

    await user.clear(screen.getByLabelText('원가'));
    await user.type(screen.getByLabelText('원가'), '5000');

    await user.clear(screen.getByLabelText('상품명'));
    await user.type(screen.getByLabelText('상품명'), '딸기 2팩');
    await user.clear(screen.getByLabelText('상품 한줄 홍보글'));

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

  it('opens a route-target edit modal when the product is outside the loaded groups', async () => {
    const handleAutoOpenProductMissing = vi.fn();

    render(
      <MemoryRouter>
        <ToastProvider defaultDurationMs={null}>
          <OverlayProvider>
            <ProductEditProductListWithActions
              autoOpenProductId='999'
              groups={[
                {
                  title: '2026년 8월 15일',
                  products: [
                    {
                      productId: 101,
                      productName: '딸기 2팩',
                      salePrice: '4,500',
                    },
                  ],
                },
              ]}
              onAutoOpenProductMissing={handleAutoOpenProductMissing}
            />
          </OverlayProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();
    expect(mockUseProductDetailQuery).toHaveBeenCalledWith({ marketId: 1, productId: 999 });
    expect(handleAutoOpenProductMissing).not.toHaveBeenCalled();
  });

  it('does not open edit modal when the product id is empty', async () => {
    const user = userEvent.setup();
    const handleAutoOpenProductMissing = vi.fn();

    render(
      <MemoryRouter>
        <OverlayProvider>
          <ProductEditProductListWithActions
            autoOpenProductId=''
            editModalVariant='todaySpecial'
            groups={[
              {
                title: '2026년 8월 15일',
                products: [
                  {
                    categoryName: '채소/과일',
                    productId: '',
                    productName: '딸기 2팩',
                    salePrice: '4,500',
                  },
                ],
              },
            ]}
            onAutoOpenProductMissing={handleAutoOpenProductMissing}
          />
        </OverlayProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(handleAutoOpenProductMissing).toHaveBeenCalledWith('');
    });

    await user.click(screen.getByRole('button', { name: '딸기 2팩 상품 수정' }));

    expect(mockUseProductDetailQuery).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the searched product modal immediately while bulk selection mode is active', async () => {
    const user = userEvent.setup();
    const groups = [
      {
        title: '2026년 8월 15일',
        products: [
          {
            categoryName: '채소/과일',
            endDate: '2026. 8. 16',
            originalPrice: '5,000',
            productId: 101,
            productName: '딸기 2팩',
            salePrice: '4,500',
          },
        ],
      },
    ];
    const { rerender } = render(
      <MemoryRouter>
        <ToastProvider defaultDurationMs={null}>
          <OverlayProvider>
            <ProductEditProductListWithActions
              autoOpenProductId='101'
              groups={groups}
              selectionMode
            />
          </OverlayProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '딸기 2팩 상품 수정' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '취소' }));

    rerender(
      <MemoryRouter>
        <ToastProvider defaultDurationMs={null}>
          <OverlayProvider>
            <ProductEditProductListWithActions autoOpenProductId='101' groups={groups} />
          </OverlayProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('updates category from edit modal category dropdown', async () => {
    const user = userEvent.setup();
    const handleUpdateProduct = vi.fn();

    renderProductList(
      [
        {
          title: '채소/과일',
          products: [
            {
              categoryName: '채소/과일',
              endDate: '2026. 8. 16',
              productId: 201,
              productName: '햇감자 1kg',
              salePrice: '3,900',
              startDate: '2026. 8. 12',
              viewCount: 241,
            },
          ],
        },
      ],
      'eventDiscount',
      undefined,
      handleUpdateProduct,
    );

    await user.click(screen.getByRole('button', { name: '햇감자 1kg 상품 수정' }));

    expect(
      await screen.findByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).toBeInTheDocument();
    expect(mockUseProductDetailQuery).toHaveBeenCalledWith({ marketId: 1, productId: 201 });
    expect(screen.getByLabelText('상품 한줄 홍보글')).toHaveValue('상세 조회 홍보글');
    expect(screen.getByLabelText('판매가')).toHaveValue('3,900');
    expect(screen.getByLabelText('행사 시작일')).toHaveValue('2026-08-12');
    expect(screen.getByLabelText('행사 종료일')).toHaveValue('2026-08-16');

    await user.click(screen.getByRole('button', { name: '채소･과일' }));

    const categoryDropdown = await screen.findByRole('group', { name: '상품 구분 선택' });

    expect(
      categoryDropdown.style.getPropertyValue('--product-category-dropdown-max-height'),
    ).toMatch(/px$/);
    expect(getComputedStyle(categoryDropdown).overflowY).toBe('auto');

    fireEvent.scroll(categoryDropdown);
    fireEvent.scroll(document);
    expect(categoryDropdown).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '정육･달걀' }));

    expect(screen.getByRole('button', { name: '정육･달걀' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: '상품 구분 선택' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '변경하기' }));

    expect(mockSubmitProductUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        currentThumbnailUrl: null,
        dealType: 'PERIODIC',
        imageFile: null,
        marketId: 1,
        productId: 201,
        values: expect.objectContaining({ categoryName: '정육/달걀' }),
      }),
    );
    expect(handleUpdateProduct).toHaveBeenCalledWith(
      201,
      expect.objectContaining({
        categoryName: '정육/달걀',
        productName: '햇감자 1kg',
      }),
    );
    expect(
      screen.queryByRole('dialog', { name: '판매 정보를 수정해주세요' }),
    ).not.toBeInTheDocument();
  });

  it('keeps the edited values and modal open when product update fails', async () => {
    const user = userEvent.setup();
    const handleUpdateProduct = vi.fn();
    mockSubmitProductUpdate.mockResolvedValueOnce({ success: false });

    renderProductList(
      [
        {
          title: '채소/과일',
          products: [
            {
              categoryName: '채소/과일',
              endDate: '2026. 8. 16',
              productId: 201,
              productName: '햇감자 1kg',
              salePrice: '3,900',
              startDate: '2026. 8. 12',
            },
          ],
        },
      ],
      'eventDiscount',
      undefined,
      handleUpdateProduct,
    );

    await user.click(screen.getByRole('button', { name: '햇감자 1kg 상품 수정' }));
    fireEvent.change(await screen.findByLabelText('판매가'), { target: { value: '4200' } });
    await user.click(screen.getByRole('button', { name: '변경하기' }));

    expect(screen.getByRole('dialog', { name: '판매 정보를 수정해주세요' })).toBeInTheDocument();
    expect(screen.getByLabelText('판매가')).toHaveValue('4,200');
    expect(handleUpdateProduct).not.toHaveBeenCalled();
  });

  it('disables modal actions while product update is pending', async () => {
    const user = userEvent.setup();
    mockUseProductUpdateFlow.mockReturnValue({
      isPending: true,
      submitProductUpdate: mockSubmitProductUpdate,
    });

    renderProductList([
      {
        title: '2026년 8월 15일',
        products: [
          {
            categoryName: '채소/과일',
            endDate: '2026. 8. 16',
            originalPrice: '5,000',
            productId: 101,
            productName: '딸기 2팩',
            salePrice: '4,500',
          },
        ],
      },
    ]);

    await user.click(screen.getByRole('button', { name: '딸기 2팩 상품 수정' }));

    expect(await screen.findByRole('button', { name: '취소' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
    expect(screen.getByRole('dialog').querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('closes the overlay and shows a toast when product detail loading fails', async () => {
    const user = userEvent.setup();

    mockUseProductDetailQuery.mockReturnValueOnce({
      data: undefined,
      isError: true,
      isPending: false,
    });

    renderProductList([
      {
        title: '2026년 8월 15일',
        products: [
          {
            categoryName: '채소/과일',
            endDate: '2026. 8. 16',
            originalPrice: '5,000',
            productId: 101,
            productName: '딸기 2팩',
            salePrice: '4,500',
            viewCount: 162,
          },
        ],
      },
    ]);

    await user.click(screen.getByRole('button', { name: '딸기 2팩 상품 수정' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '상품 정보를 불러오지 못했어요. 다시 시도해주세요.',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps edit modal open when backdrop is pressed', async () => {
    const user = userEvent.setup();

    renderProductList([
      {
        title: '2026년 8월 15일',
        products: [
          {
            categoryName: '채소/과일',
            endDate: '2026. 8. 16',
            originalPrice: '5,000',
            productId: 101,
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
          title: '채소/과일',
          products: [
            {
              categoryName: '채소/과일',
              endDate: '2026. 8. 16',
              productId: 201,
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

  it('enables event discount submit when another field changes with an unchanged past start date', async () => {
    const user = userEvent.setup();

    renderProductList(
      [
        {
          title: '채소/과일',
          products: [
            {
              categoryName: '채소/과일',
              endDate: '2026. 8. 16',
              productId: 202,
              productName: '햇감자 1kg',
              salePrice: '3,900',
              startDate: '2020. 8. 12',
            },
          ],
        },
      ],
      'eventDiscount',
    );

    await user.click(screen.getByRole('button', { name: '햇감자 1kg 상품 수정' }));

    expect(await screen.findByLabelText('행사 시작일')).toHaveValue('2020-08-12');
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('판매가'), { target: { value: '4200' } });

    expect(screen.getByRole('button', { name: '변경하기' })).toBeEnabled();
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
              categoryName: '채소/과일',
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

  it('opens delete confirmation even when product data contains ended period', async () => {
    const user = userEvent.setup();
    const deletedProducts: string[] = [];

    renderProductList(
      [
        {
          title: '2020년 8월 15일',
          products: [
            {
              categoryName: '채소/과일',
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

    expect(
      await screen.findByRole('dialog', {
        name: /행사 기간이 아직 남았어요\.\s*정말 삭제하시겠어요\?/,
      }),
    ).toBeInTheDocument();
    expect(deletedProducts).toEqual([]);

    await user.click(screen.getByRole('button', { name: '삭제하기' }));

    expect(deletedProducts).toEqual(['지난 딸기 2팩']);
  });
});
