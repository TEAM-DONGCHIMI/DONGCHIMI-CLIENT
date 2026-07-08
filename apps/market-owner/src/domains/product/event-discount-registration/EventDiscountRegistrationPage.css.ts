import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

export const pageRootClassName = style({
  position: 'relative',
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

export const toastSlotClassName = style({
  position: 'fixed',
  top: '3.2rem',
  left: 'calc(29rem + (100vw - 29rem) / 2)',
  zIndex: 30,
  transform: 'translateX(-50%)',
});
