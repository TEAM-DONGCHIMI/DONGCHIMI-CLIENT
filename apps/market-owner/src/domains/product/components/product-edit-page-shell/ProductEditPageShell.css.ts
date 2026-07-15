import { style, styleVariants } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  display: 'flex',
  height: '100%',
  minHeight: 0,
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: atomic.neutral[5],
  color: atomic.neutral[90],
});

export const scrollFixedHeaderClassName = style({
  flexShrink: 0,
  zIndex: 10,
  backgroundColor: atomic.neutral[5],
});

export const controlClassName = style({
  display: 'grid',
  padding: '3.2rem 4rem 3.8rem',
  backgroundColor: atomic.neutral[5],
});

export const headingBlockClassName = style({
  display: 'grid',
  gap: '0.4rem',
  marginBottom: '2rem',
});

export const headingClassName = style({
  ...typography['heading-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
});

export const descriptionClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  color: atomic.neutral[60],
});

export const tabsAndActionsClassName = style({
  display: 'flex',
  minWidth: 0,
  alignItems: 'end',
  justifyContent: 'space-between',
  marginBottom: '1.6rem',
});

export const actionGroupClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '0.8rem',
});

export const selectedProductCountClassName = style({
  ...typography['body-3-medium'],
  marginRight: '0.8rem',
  color: atomic.neutral[70],
  whiteSpace: 'nowrap',
});

export const selectedProductNumberClassName = style({
  color: semantic.primary.strong,
});

const actionButtonBaseClassName = style({
  minWidth: '11.2rem',
  padding: '0.8rem 0',
});

export const actionButtonClassNames = styleVariants({
  negative: [
    actionButtonBaseClassName,
    {
      backgroundColor: atomic.common[0],
    },
  ],
  negativeSolid: [actionButtonBaseClassName],
  primary: [actionButtonBaseClassName],
  primarySolid: [actionButtonBaseClassName],
  reset: [
    actionButtonBaseClassName,
    {
      backgroundColor: atomic.common[0],
      minWidth: '8rem',
    },
  ],
});

export const filterRowClassName = style({
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.8rem',
});

export const categoryFilterClassName = style({
  position: 'relative',
  display: 'inline-flex',
});

export const contentClassName = style({
  flex: 1,
  minHeight: 0,
  padding: '0 4rem 5.6rem',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
});

export const dropdownMenuClassName = style({
  position: 'absolute',
  top: 'calc(100% + 0.8rem)',
  left: 0,
  zIndex: 20,
  width: '20.6rem',
  overflowY: 'auto',
});
