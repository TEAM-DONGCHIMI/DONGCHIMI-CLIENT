import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/app/AppProviders';
import { useAuthStore } from '@/shared/stores/auth-store';
import { fireEvent, render, screen, userEvent } from '@/test';

import { ProductEditPageShell } from './ProductEditPageShell';

const mockUseProductSearchQuery = vi.hoisted(() => vi.fn());

vi.mock('@/domains/product/hooks/use-product-search-query', () => ({
  useProductSearchQuery: mockUseProductSearchQuery,
}));

describe('ProductEditPageShell', () => {
  beforeEach(() => {
    useAuthStore.getState().setMarketId(1);
    mockUseProductSearchQuery.mockReturnValue({
      data: undefined,
      isError: false,
      isFetching: false,
    });
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
    vi.unstubAllGlobals();
  });

  it('scrolls the event discount category options inside the viewport boundary', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AppProviders>
          <ProductEditPageShell
            activeType='eventDiscount'
            productCounts={{ eventDiscount: 2, todaySpecial: 1 }}
          >
            <div>상품 목록</div>
          </ProductEditPageShell>
        </AppProviders>
      </MemoryRouter>,
    );

    vi.stubGlobal('innerHeight', 500);
    const categoryTrigger = screen.getByRole('button', { name: '카테고리별' });
    vi.spyOn(categoryTrigger, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 300, 206, 40),
    );

    await user.click(categoryTrigger);

    const dropdown = await screen.findByRole('group', { name: '카테고리 선택' });

    expect(dropdown.style.getPropertyValue('--product-category-dropdown-max-height')).toBe('112px');
    expect(getComputedStyle(dropdown).overflowY).toBe('auto');
    expect(getComputedStyle(dropdown).overscrollBehaviorY).toBe('none');

    fireEvent.scroll(dropdown);

    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText('상품 목록')).toBeInTheDocument();
  });
});
