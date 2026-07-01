import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../test';
import {
  gridItemColumnSpanClassNames,
  gridItemColumnStartClassNames,
  gridItemRowSpanClassNames,
} from '../layout.css';
import { GridItem } from './GridItem';

describe('GridItem', () => {
  it('preserves semantic override and native props', () => {
    render(
      <GridItem
        as='article'
        className='custom-grid-item'
        colSpan={2}
        colStart={1}
        data-testid='grid-item'
        rowSpan={2}
      >
        Grid item
      </GridItem>,
    );

    const item = screen.getByTestId('grid-item');

    expect(item.tagName).toBe('ARTICLE');
    expect(item).toHaveClass('custom-grid-item');
    expect(item).toHaveClass(gridItemColumnSpanClassNames[2]);
    expect(item).toHaveClass(gridItemColumnStartClassNames[1]);
    expect(item).toHaveClass(gridItemRowSpanClassNames[2]);
  });
});
