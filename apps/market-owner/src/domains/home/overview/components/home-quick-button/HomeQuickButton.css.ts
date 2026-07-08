import { globalStyle, style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;
const hoverOverlayColor = 'rgba(51, 61, 75, 0.25)';

export const buttonClassName = style({
  appearance: 'none',
  position: 'relative',
  display: 'grid',
  width: '100%',
  height: '7.4rem',
  boxSizing: 'border-box',
  alignItems: 'center',
  gap: '1.6rem',
  gridTemplateColumns: 'minmax(0, 1fr) 4.6rem',
  overflow: 'hidden',
  border: 0,
  borderRadius: '1.2rem',
  padding: '1.4rem 2.2rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&::after': {
      position: 'absolute',
      inset: 0,
      backgroundColor: hoverOverlayColor,
      content: '',
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 130ms ease',
    },
    '&:not(:disabled):hover::after': {
      opacity: 1,
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

export const textClassName = style({
  display: 'grid',
  minWidth: 0,
  gap: '0.2rem',
});

export const labelClassName = style({
  ...typography['body-2-semibold'],
  overflow: 'hidden',
  color: atomic.neutral[90],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const descriptionClassName = style({
  ...typography['caption-1-medium'],
  overflow: 'hidden',
  color: atomic.neutral[70],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const visualSlotClassName = style({
  display: 'inline-flex',
  width: '4.6rem',
  height: '4.6rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.8rem',
  backgroundColor: semantic.primary.light,
});

globalStyle(`${visualSlotClassName} > :is(img, svg)`, {
  maxWidth: '100%',
  maxHeight: '100%',
});
