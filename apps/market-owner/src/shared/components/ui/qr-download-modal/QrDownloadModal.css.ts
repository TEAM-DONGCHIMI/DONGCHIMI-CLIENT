import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

const downloadButtonActionStyle = {
  ...typography['heading-3-semibold'],
  color: atomic.neutral[70],
  letterSpacing: '-0.04rem',
  textDecorationLine: 'none',
};

export const modalClassName = style({
  alignItems: 'center',
  justifyItems: 'center',
  gap: '1.4rem',
  padding: '4rem 5.2rem',
  borderRadius: '3.6rem',
  boxShadow: 'none',
});

export const qrImageClassName = style({
  width: '27rem',
  aspectRatio: '1',
  backgroundColor: atomic.common[0],
  objectFit: 'cover',
});

export const downloadButtonClassName = style({
  ...downloadButtonActionStyle,
  width: '21.6rem',
  maxWidth: '100%',
  paddingBlock: '0.2rem',
  textAlign: 'center',
  selectors: {
    '&&:not(:disabled):hover': {
      ...downloadButtonActionStyle,
    },
    '&&:focus-visible': {
      ...downloadButtonActionStyle,
    },
  },
});

export const downloadButtonLabelClassName = style({
  borderBottom: `0.15rem solid ${atomic.neutral[70]}`,
});
