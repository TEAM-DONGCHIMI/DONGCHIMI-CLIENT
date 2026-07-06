import { style } from '@vanilla-extract/css';

import { atomic, shadow } from '@dongchimi/design-system/tokens';

export const authLayoutRootClassName = style({
  display: 'grid',
  minHeight: '100vh',
  boxSizing: 'border-box',
  placeItems: 'center',
  padding: '4rem',
  backgroundColor: atomic.neutral[10],
});

export const authLayoutContentClassName = style({
  width: '44rem',
  maxWidth: '100%',
  overflow: 'hidden',
  borderRadius: '1.6rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
});
