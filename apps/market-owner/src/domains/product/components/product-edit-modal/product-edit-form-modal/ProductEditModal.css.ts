import { globalStyle, style } from '@vanilla-extract/css';

import { recipe } from '@dongchimi/design-system/styles';
import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

import * as Content from '../ProductEditModalContent.css';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const contentClassName = Content.contentClassName;

export const containerRecipe = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    minWidth: 0,
    flexDirection: 'column',
    backgroundColor: atomic.common[0],
    color: atomic.neutral[90],
    gap: '4rem',
  },
});

export const titleClassName = style({
  ...typography['heading-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const bodyClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '2rem',
});

export const sectionClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  gridTemplateColumns: '6.6rem 1fr',
  columnGap: '14rem',
});

export const sectionTitleClassName = style({
  ...typography['body-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const fieldLabelClassName = style({
  ...typography['body-3-semibold'],
  color: atomic.neutral[70],
});

export const formColumnRecipe = recipe({
  base: {
    display: 'flex',
    flex: '0 1 auto',
    minWidth: 0,
    flexDirection: 'column',
    gap: '2rem',
  },
});

export const fieldGroupClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.8rem',
});

const fieldGridBaseClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  gap: '2.4rem',
});

export const productInfoGridClassName = style([
  fieldGridBaseClassName,
  {
    gridTemplateColumns: '31.9rem 13.4rem',
    columnGap: '4.8rem',
  },
]);

export const priceGridRecipe = recipe({
  base: [
    fieldGridBaseClassName,
    {
      columnGap: '4.6rem',
    },
  ],
  variants: {
    variant: {
      eventDiscount: {
        gridTemplateColumns: '31.9rem',
      },
      todaySpecial: {
        gridTemplateColumns: 'repeat(2, 31.9rem)',
      },
    },
  },
});

export const categoryFieldClassName = style({
  position: 'relative',
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.8rem',
});

export const categoryTriggerClassName = style({
  ...typography['body-2-medium'],
  appearance: 'none',
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  height: '4rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `1px solid ${atomic.neutral[20]}`,
  borderRadius: '0.4rem',
  padding: '1rem 1.6rem',
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
  top: '6.6rem',
  right: 0,
  zIndex: 1,
  width: '100%',
});

export const dateRowClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: '1.2rem',
});

export const dateDividerClassName = style({
  ...typography['title-2-semibold'],
  flexShrink: 0,
  color: atomic.neutral[70],
});

export const dateFieldClassName = style({
  width: '25rem',
  flex: '0 1 25rem',
  minWidth: 0,
});

globalStyle(`${dateFieldClassName} label`, {
  height: '4rem',
  padding: '1rem 1.6rem',
});

export const periodToggleButtonClassName = style({
  flexShrink: 0,
  width: '13.7rem',
  minWidth: '13.7rem',
  height: '4rem',
  borderRadius: '10rem',
  paddingRight: '1.6rem',
  paddingLeft: '1.6rem',
});

export const footerClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  justifyContent: 'flex-end',
  gap: '1.4rem',
});

export const footerButtonClassName = style({
  width: '16rem',
  minWidth: '16rem',
  height: '4.4rem',
});
