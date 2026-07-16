import { style } from '@vanilla-extract/css';

import * as Content from './ProductEditModalContent.css';

export const contentClassName = style({
  width: '100%',
  minWidth: 0,
});

export const dateRowClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gridTemplateColumns: 'minmax(0, 1fr) max-content',
  columnGap: '0.8rem',
});

export const dateFieldClassName = style([
  Content.dateFieldLabelClassName,
  {
    width: '100%',
    minWidth: 0,
  },
]);
