import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

export const pageRootClassName = style({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  boxSizing: 'border-box',
  padding: 0,
  backgroundColor: atomic.neutral[10],
});
