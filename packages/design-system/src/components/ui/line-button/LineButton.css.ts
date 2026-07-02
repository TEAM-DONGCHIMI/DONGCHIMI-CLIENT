import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const lineButton = style({
  ...typography['body-3-semibold'],
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderWidth: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[40],
  textDecorationLine: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:hover': {
      textDecorationLine: 'underline',
    },
    '&:focus-visible': {
      textDecorationLine: 'underline',
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});
