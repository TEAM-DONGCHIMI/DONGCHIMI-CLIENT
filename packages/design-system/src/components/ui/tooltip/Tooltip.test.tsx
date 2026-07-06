import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders children with the tooltip role', () => {
    render(<Tooltip>메시지에 마침표를 찍어요.</Tooltip>);

    expect(screen.getByRole('tooltip')).toHaveTextContent('메시지에 마침표를 찍어요.');
  });

  it('applies a direction-specific arrow style per space', () => {
    const { container, rerender } = render(<Tooltip space='top'>안내</Tooltip>);
    const topArrowClass = container.querySelector('svg')?.getAttribute('class');

    rerender(<Tooltip space='bottom'>안내</Tooltip>);
    const bottomArrowClass = container.querySelector('svg')?.getAttribute('class');

    expect(topArrowClass).toBeTruthy();
    expect(topArrowClass).not.toBe(bottomArrowClass);
  });

  it('allows overriding the default role via native props', () => {
    render(<Tooltip role='status'>안내</Tooltip>);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('forwards native div props and className', () => {
    render(
      <Tooltip className='custom' aria-label='안내 툴팁'>
        안내
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip', { name: '안내 툴팁' })).toHaveClass('custom');
  });

  it('forwards ref to the container element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Tooltip ref={ref}>안내</Tooltip>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
