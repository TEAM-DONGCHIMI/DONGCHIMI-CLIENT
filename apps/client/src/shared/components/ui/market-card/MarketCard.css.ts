import { style } from '@vanilla-extract/css';

import { recipe } from '@dongchimi/design-system/styles';
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
    padding: '0.4rem',
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

// TODO: chip 컴포넌트 교체
export const saleChipClassName = style({
  ...typography['caption-2-medium'],
  position: 'absolute',
  top: '0.6rem',
  right: '0.6rem',
  display: 'inline-flex',
  width: '2.8rem',
  height: '2.8rem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: semantic.status.negative,
  clipPath:
    'polygon(50% 0%, 61% 22%, 85% 15%, 78% 39%, 100% 50%, 78% 61%, 85% 85%, 61% 78%, 50% 100%, 39% 78%, 15% 85%, 22% 61%, 0% 50%, 22% 39%, 15% 15%, 39% 22%)',
  color: atomic.common[0],
  lineHeight: 1,
});
