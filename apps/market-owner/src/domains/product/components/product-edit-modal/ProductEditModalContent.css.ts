import { style } from '@vanilla-extract/css';

import { shadow } from '@dongchimi/design-system/tokens';

export const contentClassName = style({
  width: '100.8rem',
  maxWidth: 'calc(100vw - 3.2rem)',
  padding: '5.6rem 5.9rem',
  borderRadius: '2.4rem',
  boxShadow: shadow.normal.medium,
});
