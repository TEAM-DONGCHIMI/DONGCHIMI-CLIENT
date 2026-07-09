import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const sectionClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  minHeight: 'calc(100vh - 6.4rem)',
  flexDirection: 'column',
  padding: '3.2rem 3.2rem 3rem',
  backgroundColor: atomic.neutral[5],
});

export const headingContainerClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '0.4rem',
});

export const titleClassName = style({
  ...typography['heading-1-semibold'],
  margin: 0,
  color: '#101828',
});

export const descriptionClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  color: '#6A7282',
});

export const requiredMarkClassName = style({
  color: semantic.primary.normal,
});

export const tableContainerClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  marginTop: '3.2rem',
});

export const tableScrollClassName = style({
  width: '100%',
  minWidth: 0,
  overflowX: 'auto',
  scrollbarWidth: 'thin',
});

export const tableClassName = style({
  width: '100%',
  minWidth: '137.6rem',
});

export const tableHeaderClassName = style({
  boxSizing: 'border-box',
  display: 'grid',
  height: '7.4rem',
  gridTemplateColumns: '6.1rem 10rem 19.6rem 14.7rem 16rem 36.5rem 23rem 12.8rem',
  alignItems: 'stretch',
  border: `1px solid ${atomic.neutral[30]}`,
  backgroundColor: atomic.common[0],
});

export const headerCellClassName = style({
  ...typography['body-3-medium'],
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.2rem',
  padding: '2.4rem',
  color: atomic.neutral[60],
  whiteSpace: 'nowrap',
  selectors: {
    '&:first-child': {
      justifyContent: 'center',
      padding: '2.5rem 2rem',
    },
    '&:nth-child(2)': {
      paddingLeft: '0.4rem',
    },
    '&:nth-child(3)': {
      paddingLeft: '1rem',
    },
    '&:nth-child(4)': {
      paddingLeft: '1.6rem',
    },
    '&:nth-child(5)': {
      paddingLeft: '2.4rem',
    },
    '&:nth-child(6)': {
      paddingLeft: '3.3rem',
    },
    '&:nth-child(7)': {
      paddingLeft: '2.8rem',
    },
    '&:nth-child(8)': {
      paddingLeft: '3.9rem',
      color: '#6B7280',
    },
  },
});

export const headerSelectionButtonClassName = style({
  appearance: 'none',
  display: 'inline-flex',
  width: '2.4rem',
  height: '2.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  borderRadius: '0.4rem',
  padding: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[70],
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
    position: 'relative',
    boxSizing: 'border-box',
    display: 'inline-flex',
    width: '1.8rem',
    height: '1.8rem',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1.5px solid ${atomic.neutral[70]}`,
    borderRadius: '0.4rem',
    backgroundColor: atomic.common[0],
  },
  variants: {
    checked: {
      false: {},
      true: {
        borderColor: semantic.primary.normal,
        backgroundColor: semantic.primary.normal,
        selectors: {
          '&::after': {
            content: "''",
            position: 'absolute',
            top: '0.2rem',
            left: '0.5rem',
            width: '0.5rem',
            height: '0.9rem',
            borderRight: `2px solid ${atomic.common[0]}`,
            borderBottom: `2px solid ${atomic.common[0]}`,
            transform: 'rotate(45deg)',
          },
        },
      },
    },
  },
});

export const listClassName = style({
  minHeight: '39.2rem',
});

export const emptyStateClassName = style({
  ...typography['body-2-medium'],
  display: 'flex',
  minHeight: '39.2rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: `1px solid ${atomic.neutral[30]}`,
  borderBottom: `1px solid ${atomic.neutral[30]}`,
  borderLeft: `1px solid ${atomic.neutral[30]}`,
  backgroundColor: atomic.common[0],
  color: atomic.neutral[60],
});

export const productPreviewClassName = style({
  ...typography['caption-1-medium'],
  display: 'inline-flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: semantic.primary.light,
  color: semantic.primary.strong,
});

export const bottomBarClassName = style({
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2rem',
  marginTop: '3.2rem',
  backgroundColor: atomic.neutral[5],
});

export const statusNoticeRecipe = recipe({
  base: {
    ...typography['body-3-semibold'],
    boxSizing: 'border-box',
    display: 'inline-flex',
    height: '3.6rem',
    alignItems: 'center',
    gap: '0.8rem',
    margin: 0,
    border: `0.2rem solid ${semantic.status.negativeLight}`,
    borderRadius: '2.8rem',
    padding: '0.8rem 1.6rem',
    color: semantic.status.negative,
    whiteSpace: 'nowrap',
  },
  variants: {
    visible: {
      false: {
        visibility: 'hidden',
      },
      true: {},
    },
  },
});

export const actionGroupClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '1.4rem',
});

const actionButtonBaseClassName = style({
  ...typography['body-3-semibold'],
  appearance: 'none',
  display: 'inline-flex',
  width: '15.1rem',
  height: '4.4rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.8rem',
  padding: '1.2rem 3.2rem',
  whiteSpace: 'nowrap',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});

export const previousButtonClassName = style([
  actionButtonBaseClassName,
  {
    border: `1px solid ${atomic.neutral[40]}`,
    backgroundColor: atomic.common[0],
    color: atomic.neutral[90],
    cursor: 'pointer',
  },
]);

export const registerButtonClassName = style([
  actionButtonBaseClassName,
  {
    border: 0,
    backgroundColor: semantic.primary.normal,
    color: atomic.common[0],
    cursor: 'pointer',
    selectors: {
      '&:disabled': {
        backgroundColor: atomic.neutral[30],
        cursor: 'not-allowed',
      },
    },
  },
]);
