import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const rootClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '9.4rem',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.4rem',
  color: atomic.neutral[90],
});

export const interactiveRootClassName = style({
  border: 0,
  padding: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:focus-visible': {
      borderRadius: 12,
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 4,
    },
  },
});

export const imageFrameClassName = style({
  position: 'relative',
  display: 'block',
  width: '9.4rem',
  height: '9.4rem',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: 12,
  backgroundColor: atomic.neutral[10],
});

export const imageClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const imageFallbackClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  backgroundColor: atomic.neutral[10],
  backgroundImage:
    'linear-gradient(45deg, rgba(255, 255, 255, 0.7) 25%, transparent 25%), linear-gradient(-45deg, rgba(255, 255, 255, 0.7) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.7) 75%), linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.7) 75%)',
  backgroundPosition: '0 0, 0 0.6rem, 0.6rem -0.6rem, -0.6rem 0',
  backgroundSize: '1.2rem 1.2rem',
});

export const contentClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'flex-start',
});

export const productNameClassName = style({
  ...typography['caption-1-medium'],
  display: '-webkit-box',
  width: '100%',
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[70],
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  wordBreak: 'break-word',
});

export const priceRowClassName = style({
  ...typography['body-3-semibold'],
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  color: atomic.neutral[90],
  whiteSpace: 'nowrap',
});

export const priceTextClassName = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const priceUnitClassName = style({
  flexShrink: 0,
});
