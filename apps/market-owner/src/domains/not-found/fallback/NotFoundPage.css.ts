import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  display: 'grid',
  boxSizing: 'border-box',
  minHeight: '100svh',
  placeItems: 'center',
  padding: '2.4rem',
  overflow: 'auto',
  backgroundColor: atomic.neutral[5],
});

export const contentClassName = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  transform: 'translateY(3.2rem)',
  '@media': {
    '(max-height: 600px)': {
      transform: 'none',
    },
  },
});

export const illustrationClassName = style({
  display: 'block',
  width: '26.2rem',
  height: '26.2rem',
});

export const titleClassName = style({
  ...typography['heading-3-semibold'],
  margin: '2.8rem 0 0',
  color: atomic.neutral[80],
  textAlign: 'center',
});

export const homeButtonClassName = style({
  width: '19.2rem',
  minWidth: 0,
  marginTop: '3rem',
});
