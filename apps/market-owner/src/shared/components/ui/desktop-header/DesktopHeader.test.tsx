import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../../test';
import { DesktopHeader } from './DesktopHeader';

describe('DesktopHeader', () => {
  it('renders parent and current page labels in default mode', () => {
    render(<DesktopHeader currentLabel='상품 수정' parentLabel='상품 관리' />);

    expect(screen.getByRole('navigation', { name: '현재 위치' })).toBeInTheDocument();
    expect(screen.getByText('상품 관리')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('상품 수정')).toHaveAttribute('aria-current', 'page');
  });

  it('renders home label in only home mode', () => {
    render(<DesktopHeader variant='onlyHome' />);

    expect(screen.getByText('동치미 작업 홈')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: '현재 위치' })).not.toBeInTheDocument();
  });

  it('renders SearchBar and submits the search value', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();

    render(
      <DesktopHeader
        currentLabel='홈'
        onSearch={handleSearch}
        parentLabel='오늘의 특가 상품 등록'
      />,
    );

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '감자');
    await user.keyboard('{Enter}');

    expect(handleSearch).toHaveBeenCalledWith('감자', expect.any(Object));
  });

  it('renders custom search slot when provided', () => {
    render(
      <DesktopHeader
        currentLabel='홈'
        parentLabel='동치미 점주 홈'
        searchSlot={<div data-testid='product-search-panel'>상품 검색 패널</div>}
      />,
    );

    expect(screen.getByTestId('product-search-panel')).toBeInTheDocument();
    expect(screen.queryByRole('searchbox', { name: '상품 검색' })).not.toBeInTheDocument();
  });
});
