import { style } from '@vanilla-extract/css';

import { recipe } from '@dongchimi/design-system/styles';
import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

import * as Content from '../ProductEditModalContent.css';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;
const categoryFieldWidth = '20.6rem';

export const contentClassName = style([
  Content.contentClassName,
  {
    height: '81.2rem',
  },
]);
export const containerClassName = Content.containerClassName;
export const titleClassName = Content.titleClassName;

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
  gridTemplateColumns: 'max-content minmax(0, 1fr)',
  columnGap: '14rem',
});

export const sectionTitleClassName = Content.sectionTitleClassName;
export const fieldLabelClassName = Content.fieldLabelClassName;

export const formColumnClassName = style({
  display: 'flex',
  flex: '0 1 auto',
  minWidth: 0,
  flexDirection: 'column',
  gap: '2rem',
});

export const fieldGroupClassName = Content.fieldGroupClassName;

const fieldGridBaseClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  gap: '2.4rem',
});

export const productInfoGridClassName = style([
  fieldGridBaseClassName,
  {
    gridTemplateColumns: `minmax(0, ${Content.editModalFieldWidth}) minmax(0, ${categoryFieldWidth})`,
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
        gridTemplateColumns: `minmax(0, ${Content.editModalFieldWidth})`,
      },
      todaySpecial: {
        gridTemplateColumns: `repeat(2, minmax(0, ${Content.editModalFieldWidth}))`,
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
  top: 'calc(100% + 0.8rem)',
  right: 0,
  zIndex: 1,
  width: categoryFieldWidth,
});

export const dateRowClassName = style({
  display: 'grid',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gridTemplateColumns: 'minmax(0, 1fr) max-content',
  columnGap: '0.8rem',
});

export const dateRangeClassName = Content.dateRangeClassName;
export const dateDividerClassName = Content.dateDividerClassName;

export const dateFieldClassName = style([
  Content.dateFieldLabelClassName,
  {
    width: '100%',
    minWidth: 0,
  },
]);

export const periodToggleButtonClassName = Content.periodToggleButtonClassName;
export const footerClassName = Content.footerClassName;
export const footerButtonClassName = Content.footerButtonClassName;
