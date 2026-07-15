import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const rootRecipe = recipe({
  base: {
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex',
    width: '25.2rem',
    minWidth: 0,
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '1.2rem',
    padding: '1.2rem 1.6rem 1.8rem',
    backgroundColor: atomic.common[0],
    color: atomic.neutral[90],
  },
  variants: {
    selectionMode: {
      false: {},
      true: {},
    },
  },
  defaultVariants: {
    selectionMode: false,
  },
});

export const contentClassName = style({
  position: 'relative',
  zIndex: 0,
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '1rem',
});

export const headerClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.8rem',
});

export const metaClassName = style({
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.4rem',
});

export const categoryChipClassName = style({
  ...typography['caption-1-regular'],
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10rem',
  padding: '0.2rem 0.8rem',
  backgroundColor: semantic.primary.light,
  color: semantic.primary.strong,
  whiteSpace: 'nowrap',
});

export const viewChipClassName = style({
  ...typography['caption-1-medium'],
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.2rem',
  borderRadius: '0.4rem',
  padding: '0.2rem 0.8rem',
  backgroundColor: atomic.neutral[10],
  color: atomic.neutral[70],
  whiteSpace: 'nowrap',
});

export const actionGroupClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '0.4rem',
});

export const actionButtonClassName = style({
  appearance: 'none',
  display: 'inline-flex',
  width: '2.4rem',
  height: '2.4rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  borderRadius: '0.4rem',
  padding: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[90],
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
    '&:disabled': {
      cursor: 'default',
    },
  },
});

export const actionIconClassName = style({
  display: 'inline-flex',
  width: '2.4rem',
  height: '2.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  pointerEvents: 'none',
});

globalStyle(`${actionIconClassName} > svg`, {
  width: '2.4rem',
  height: '2.4rem',
});

export const productContentClassName = style({
  display: 'flex',
  width: '23rem',
  maxWidth: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '1.2rem',
});

export const productClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.6rem',
});

export const productNameClassName = style({
  ...typography['body-1-semibold'],
  display: '-webkit-box',
  width: '100%',
  minWidth: 0,
  margin: 0,
  overflow: 'hidden',
  color: atomic.neutral[90],
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
});

export const priceContentClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'flex-start',
  whiteSpace: 'nowrap',
});

export const originalPriceClassName = style({
  ...typography['caption-1-regular'],
  maxWidth: '100%',
  overflow: 'hidden',
  color: atomic.neutral[40],
  textDecoration: 'line-through',
  textOverflow: 'ellipsis',
});

export const salePriceRowClassName = style({
  ...typography['body-2-semibold'],
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.6rem',
});

export const salePercentClassName = style({
  flexShrink: 0,
  color: semantic.status.negative,
});

export const salePriceClassName = style({
  minWidth: 0,
  overflow: 'hidden',
  color: atomic.neutral[90],
  textOverflow: 'ellipsis',
});

export const dateClassName = style({
  ...typography['caption-1-regular'],
  display: 'flex',
  width: '100%',
  minWidth: 0,
  margin: 0,
  overflow: 'hidden',
  color: atomic.neutral[70],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const dimmerClassName = style({
  position: 'absolute',
  zIndex: 1,
  inset: 0,
  borderRadius: '1.2rem',
  backgroundColor: semantic.overlay.dimmer,
  pointerEvents: 'none',
});

export const selectionButtonClassName = style({
  appearance: 'none',
  position: 'absolute',
  zIndex: 2,
  inset: 0,
  display: 'inline-flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  border: 0,
  borderRadius: '1.2rem',
  padding: '1.2rem 0 0 1.6rem',
  backgroundColor: 'transparent',
  color: atomic.common[0],
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const selectionBoxRecipe = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'inline-flex',
    width: '1.8rem',
    height: '1.8rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.4rem',
  },
  variants: {
    selected: {
      false: {
        border: `1.5px dashed ${atomic.neutral[5]}`,
      },
      true: {
        border: `1px solid ${semantic.primary.normal}`,
        backgroundColor: semantic.primary.normal,
      },
    },
  },
});

export const checkIconClassName = style({
  display: 'inline-flex',
  width: '1.8rem',
  height: '1.8rem',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
});

globalStyle(`${checkIconClassName} > svg`, {
  width: '1.8rem',
  height: '1.8rem',
});
