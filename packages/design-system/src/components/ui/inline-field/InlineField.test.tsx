import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { InlineField } from './InlineField';

describe('InlineField', () => {
  it('renders a native input with an accessible name and unit', () => {
    render(<InlineField aria-label='Price' defaultValue='10000' unit='KRW' />);

    const input = screen.getByRole('textbox', { name: 'Price' });

    expect(input).toHaveValue('10000');
    expect(input).toHaveAccessibleDescription('KRW');
    expect(screen.getByText('KRW')).toBeInTheDocument();
  });

  it('preserves existing aria-describedby when connecting the unit text', () => {
    render(
      <>
        <span id='price-helper'>Enter the sale price</span>
        <InlineField aria-describedby='price-helper' aria-label='Price' unit='KRW' />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Price' })).toHaveAccessibleDescription(
      'Enter the sale price KRW',
    );
  });

  it('marks only the error state as invalid', () => {
    render(<InlineField aria-label='Price' status='error' />);

    expect(screen.getByRole('textbox', { name: 'Price' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders an error message and describes the input in the error state', () => {
    render(
      <InlineField
        aria-label='Product name'
        errorMessage='상품명을 입력해주세요.'
        status='error'
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Product name' });

    expect(screen.getByText('상품명을 입력해주세요.')).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription('상품명을 입력해주세요.');
  });

  it('preserves existing aria-describedby when connecting the error message', () => {
    render(
      <>
        <span id='product-helper'>최대 15자까지 입력할 수 있어요.</span>
        <InlineField
          aria-describedby='product-helper'
          aria-label='Product name'
          errorMessage='상품명을 입력해주세요.'
          status='error'
        />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Product name' })).toHaveAccessibleDescription(
      '최대 15자까지 입력할 수 있어요. 상품명을 입력해주세요.',
    );
  });

  it('preserves native read-only semantics', () => {
    render(<InlineField aria-label='Price' readOnly value='10000' />);

    const input = screen.getByRole('textbox', { name: 'Price' });
    expect(input).toHaveAttribute('readonly');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('forwards native input props and ref', () => {
    const ref = createRef<HTMLInputElement>();

    render(<InlineField ref={ref} aria-label='Product name' name='name' placeholder='Name' />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Product name' }));
    expect(ref.current).toHaveAttribute('name', 'name');
    expect(ref.current).toHaveAttribute('placeholder', 'Name');
  });

  it('applies className to the field root', () => {
    render(<InlineField aria-label='Price' className='custom-root' />);

    expect(screen.getByRole('textbox', { name: 'Price' }).parentElement).toHaveClass('custom-root');
  });

  it('uses aria-labelledby as an alternative accessible name', () => {
    render(
      <>
        <span id='field-label'>Option name</span>
        <InlineField aria-labelledby='field-label' />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Option name' })).toBeInTheDocument();
  });
});
