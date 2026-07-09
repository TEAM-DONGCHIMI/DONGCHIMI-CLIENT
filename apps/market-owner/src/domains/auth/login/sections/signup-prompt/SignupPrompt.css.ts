import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const rootClassName = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.2rem',
});

export const promptClassName = style({
  ...typography['caption-1-medium'],
  margin: 0,
  color: atomic.neutral[70],
});

export const linkClassName = style({
  ...typography['body-2-semibold'],
  boxSizing: 'border-box',
  display: 'inline-flex',
  width: '100%',
  minHeight: '5.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${atomic.neutral[20]}`,
  borderRadius: 8,
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  textDecoration: 'none',
  transition: 'background-color 160ms ease, border-color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:hover': {
      borderColor: atomic.neutral[40],
      backgroundColor: atomic.neutral[5],
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});
