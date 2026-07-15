import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const modalClassName = style({
  alignItems: 'center',
  justifyItems: 'center',
  gap: '1.4rem',
  padding: '4rem 5.2rem',
  borderRadius: '3.6rem',
});

export const qrImageClassName = style({
  width: '27rem',
  aspectRatio: '1',
  backgroundColor: atomic.common[0],
  objectFit: 'contain',
});

export const downloadButtonClassName = style({
  ...typography['heading-3-semibold'],
  maxWidth: '100%',
  color: atomic.neutral[70],
  letterSpacing: 0,
  textAlign: 'center',
  selectors: {
    '&:not(:disabled):hover': {
      ...typography['heading-3-semibold'],
      color: atomic.neutral[70],
      letterSpacing: 0,
      textAlign: 'center',
    },
    '&:focus-visible': {
      ...typography['heading-3-semibold'],
      color: atomic.neutral[70],
      letterSpacing: 0,
      textAlign: 'center',
    },
  },
});
