import { useState } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../../test';
import { SearchBar, type SearchBarProps } from './SearchBar';

const ControlledSearchBar = (props: Omit<SearchBarProps, 'onValueChange' | 'value'>) => {
  const [value, setValue] = useState('');

  return <SearchBar {...props} value={value} onValueChange={setValue} />;
};

describe('SearchBar', () => {
  it('renders accessible search input with the default placeholder', () => {
    render(<SearchBar icon={<span data-testid='search-icon' />} />);

    expect(screen.getByRole('search', { name: '상품 검색' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: '상품 검색' })).toHaveAttribute(
      'placeholder',
      '상품 검색...',
    );
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('calls onValueChange when the input changes', async () => {
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    const ControlledSearchBarWithChangeHandler = () => {
      const [value, setValue] = useState('');

      return (
        <SearchBar
          value={value}
          onValueChange={(nextValue, event) => {
            setValue(nextValue);
            handleValueChange(nextValue, event);
          }}
        />
      );
    };

    render(<ControlledSearchBarWithChangeHandler />);

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '양파');

    expect(handleValueChange).toHaveBeenLastCalledWith('양파', expect.any(Object));
  });

  it('calls onSearch with the current value on submit', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();

    render(<ControlledSearchBar onSearch={handleSearch} />);

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '감자');
    await user.keyboard('{Enter}');

    expect(handleSearch).toHaveBeenCalledWith('감자', expect.any(Object));
  });

  it('limits the search keyword to 17 characters', async () => {
    const user = userEvent.setup();

    render(<ControlledSearchBar />);

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '123456789012345678');

    expect(screen.getByRole('searchbox', { name: '상품 검색' })).toHaveValue('12345678901234567');
  });

  it('supports controlled value changes with the 17 character limit', async () => {
    const user = userEvent.setup();

    render(<ControlledSearchBar />);

    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '123456789012345678');

    expect(screen.getByRole('searchbox', { name: '상품 검색' })).toHaveValue('12345678901234567');
  });

  it('marks the input invalid when error state is enabled', () => {
    render(<SearchBar isError />);

    expect(screen.getByRole('searchbox', { name: '상품 검색' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('uses a custom accessible name when aria-label is provided', () => {
    render(<SearchBar aria-label='상품명 검색' />);

    expect(screen.getByRole('search', { name: '상품명 검색' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: '상품명 검색' })).toBeInTheDocument();
  });
});
