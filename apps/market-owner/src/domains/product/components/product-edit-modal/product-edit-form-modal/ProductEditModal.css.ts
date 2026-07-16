import { style } from '@vanilla-extract/css';

import { recipe } from '@dongchimi/design-system/styles';
import { atomic } from '@dongchimi/design-system/tokens';

import * as Content from '../ProductEditModalContent.css';

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

export const categoryDropdownClassName = style({
  position: 'absolute',
  top: 'calc(100% + 0.8rem)',
  right: 0,
  zIndex: 1,
  width: categoryFieldWidth,
  maxHeight: 'var(--product-category-dropdown-max-height)',
  backgroundColor: atomic.common[0],
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehaviorY: 'none',
});

export const footerClassName = Content.footerClassName;
export const footerButtonClassName = Content.footerButtonClassName;
