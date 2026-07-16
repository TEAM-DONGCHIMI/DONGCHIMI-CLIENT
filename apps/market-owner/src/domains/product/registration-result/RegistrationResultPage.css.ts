import { style } from '@vanilla-extract/css';

import { atomic } from '@dongchimi/design-system/tokens';

export const pageRootClassName = style({
  minHeight: '100vh',
  backgroundColor: atomic.neutral[5],
});

export const pageHeaderClassName = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  borderBottom: `1px solid ${atomic.neutral[20]}`,
  backgroundColor: atomic.neutral[5],
});

export const logoClassName = style({
  display: 'block',
  width: '9.2rem',
  height: '3.2rem',
  flexShrink: 0,
});
