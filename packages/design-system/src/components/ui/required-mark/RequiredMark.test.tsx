import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { RequiredMark } from './RequiredMark';

describe('RequiredMark', () => {
  it('renders a decorative mark and the required-field tooltip', () => {
    render(<RequiredMark />);

    expect(screen.getByText('*').closest('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('* 표시는 필수로 입력해야 해요.');
  });

  it('forwards native span props and ref', () => {
    const ref = createRef<HTMLSpanElement>();

    render(<RequiredMark ref={ref} aria-label='필수 입력' className='custom' />);

    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('aria-label', '필수 입력');
  });
});
