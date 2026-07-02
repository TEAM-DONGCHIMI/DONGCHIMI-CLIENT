import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('renders children', () => {
    render(
      <Dropdown>
        <button type='button'>항목</button>
      </Dropdown>,
    );

    expect(screen.getByRole('button', { name: '항목' })).toBeInTheDocument();
  });

  it('does not force a role on the panel', () => {
    const { container } = render(<Dropdown>내용</Dropdown>);

    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards native div props and className', () => {
    render(
      <Dropdown className='custom' role='menu' aria-label='정렬'>
        내용
      </Dropdown>,
    );

    expect(screen.getByRole('menu', { name: '정렬' })).toHaveClass('custom');
  });

  it('forwards ref to the panel element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Dropdown ref={ref}>내용</Dropdown>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
