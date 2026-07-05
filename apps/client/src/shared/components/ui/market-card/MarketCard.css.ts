import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const marketCard = recipe({
  base: {
    position: 'relative',
    display: 'block',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: atomic.neutral[20],
    color: atomic.common[0],
    cursor: 'pointer',

    selectors: {
      '&:focus-visible': {
        outline: `3px solid ${focusOutlineColor}`,
        outlineOffset: 2,
      },
    },
  },
  variants: {
    size: {
      small: {
        width: '10.6rem',
        height: '10.6rem',
      },
      medium: {
        width: '12rem',
        height: '12rem',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const imageClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const scrimClassName = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(48, 49, 51, 0.00) 44.45%, #303133 100%)',
  pointerEvents: 'none',
});

export const contentClassName = recipe({
  base: {
    position: 'absolute',
    right: '1rem',
    bottom: '1rem',
    left: '1rem',
    display: 'flex',
    minWidth: 0,
    flexDirection: 'column',
  },
  variants: {
    size: {
      small: {
        gap: '0.1rem',
      },
      medium: {
        gap: '0.2rem',
      },
    },
  },
});

export const productNameClassName = style({
  ...typography['caption-2-regular'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.common[0],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const priceClassName = style({
  ...typography['body-3-semibold'],
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.common[0],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const saleChipClassName = style({
  position: 'absolute',
  top: '0.4rem',
  right: '0.4rem',
});
