import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

export const pageRootClassName = style({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  boxSizing: 'border-box',
  padding: '3.2rem 5.6rem 6rem',
  backgroundColor: atomic.neutral[10],
});

export const pageHeaderClassName = style({
  minHeight: '2rem',
  padding: 0,
  backgroundColor: 'transparent',
});
