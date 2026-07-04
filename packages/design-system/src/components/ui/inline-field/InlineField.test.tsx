import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { InlineField } from './InlineField';

describe('InlineField', () => {
  it('renders a native input with an accessible name and unit', () => {
    render(<InlineField aria-label='Price' defaultValue='10000' unit='KRW' />);

    expect(screen.getByRole('textbox', { name: 'Price' })).toHaveValue('10000');
    expect(screen.getByText('KRW')).toBeInTheDocument();
  });

  it('marks only the error state as invalid', () => {
    render(<InlineField aria-label='Price' status='error' />);

    expect(screen.getByRole('textbox', { name: 'Price' })).toHaveAttribute('aria-invalid', 'true');
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
