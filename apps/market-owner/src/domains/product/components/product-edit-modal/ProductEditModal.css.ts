import { globalStyle, style } from '@vanilla-extract/css';

import { recipe } from '@dongchimi/design-system/styles';
import { atomic, semantic, shadow, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const contentRecipe = recipe({
  base: {
    maxWidth: 'calc(100vw - 32px)',
    borderRadius: 24,
    boxShadow: shadow.normal.medium,
  },
  variants: {
    variant: {
      eventDiscount: {
        width: 930,
      },
      todaySpecial: {
        width: 1008,
      },
    },
  },
});

export const containerRecipe = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    minWidth: 0,
    flexDirection: 'column',
    backgroundColor: atomic.common[0],
    color: atomic.neutral[90],
  },
  variants: {
    variant: {
      eventDiscount: {
        gap: 38,
        padding: '52px 55px 47px',
      },
      todaySpecial: {
        minHeight: 802,
        gap: 48,
        padding: 60,
      },
    },
  },
});

export const titleClassName = style({
  ...typography['title-2-semibold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const bodyClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: 36,
});

export const sectionRecipe = recipe({
  base: {
    display: 'grid',
    width: '100%',
    minWidth: 0,
  },
  variants: {
    variant: {
      eventDiscount: {
        gridTemplateColumns: '124px 1fr',
        columnGap: 60,
      },
      todaySpecial: {
        gridTemplateColumns: '124px 1fr',
        columnGap: 60,
      },
    },
  },
});

export const sectionTitleClassName = style({
  ...typography['body-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const sectionContentClassName = style({
  display: 'flex',
  minWidth: 0,
  gap: 38,
});

export const productSectionContentClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: 20,
});

export const sectionSpacerRecipe = recipe({
  base: {
    flexShrink: 0,
  },
  variants: {
    variant: {
      eventDiscount: {
        width: 112,
      },
      todaySpecial: {
        width: 120,
      },
    },
  },
});

export const fieldLabelClassName = style({
  ...typography['body-3-semibold'],
  color: atomic.neutral[90],
});

export const formColumnClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: 20,
});

export const fieldGroupClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: 8,
});

const fieldGridBaseClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  gap: 24,
});

export const productInfoGridClassName = style([
  fieldGridBaseClassName,
  {
    gridTemplateColumns: '320px 134px',
    columnGap: 48,
  },
]);

export const priceGridClassName = style([
  fieldGridBaseClassName,
  {
    gridTemplateColumns: 'repeat(2, 320px)',
    columnGap: 48,
  },
]);

export const categoryFieldClassName = style({
  position: 'relative',
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: 8,
});

export const categoryTriggerClassName = style({
  ...typography['body-2-medium'],
  appearance: 'none',
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  height: 40,
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `1px solid ${atomic.neutral[20]}`,
  borderRadius: 4,
  padding: '10px 16px',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const categoryDropdownClassName = style({
  position: 'absolute',
  top: 66,
  right: 0,
  zIndex: 1,
  width: '100%',
});

export const dateRowClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: 12,
});

export const dateDividerClassName = style({
  ...typography['title-2-semibold'],
  flexShrink: 0,
  color: atomic.neutral[70],
});

export const dateFieldClassName = style({
  width: 250,
  flexShrink: 0,
});

globalStyle(`${dateFieldClassName} label`, {
  height: 40,
  padding: '10px 16px',
});

export const footerClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  justifyContent: 'flex-end',
  gap: 14,
});

export const footerButtonClassName = style({
  width: '16rem',
  minWidth: '16rem',
  height: 44,
});
