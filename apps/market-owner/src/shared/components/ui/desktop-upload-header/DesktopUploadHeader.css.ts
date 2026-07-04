import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const headerClassName = style({
  width: '100%',
  minWidth: 0,
  backgroundColor: atomic.common[0],
});

export const segmentNavigationClassName = style({
  overflow: 'hidden',
  flexShrink: 0,
  borderTopLeftRadius: '1.2rem',
  borderTopRightRadius: '1.2rem',
});

export const segmentItemRecipe = recipe({
  base: {
    display: 'inline-flex',
    width: '15rem',
    alignItems: 'flex-start',
    gap: '0.4rem',
    border: 0,
    borderTop: `1px solid ${atomic.neutral[30]}`,
    borderRight: `1px solid ${atomic.neutral[30]}`,
    padding: '1.6rem 3.2rem',
    backgroundColor: atomic.neutral[20],
    color: atomic.neutral[60],
    selectors: {
      '&:first-child': {
        borderLeft: `1px solid ${atomic.neutral[30]}`,
        borderTopLeftRadius: '1.2rem',
      },
      '&:last-child': {
        borderTopRightRadius: '1.2rem',
      },
    },
  },
  variants: {
    active: {
      true: {
        backgroundColor: atomic.neutral[60],
        color: atomic.common[0],
      },
    },
  },
});

export const segmentLabelRecipe = recipe({
  base: {
    ...typography['body-2-regular'],
    whiteSpace: 'nowrap',
  },
  variants: {
    active: {
      true: {
        color: atomic.common[0],
      },
    },
  },
});

export const segmentCountRecipe = recipe({
  base: {
    ...typography['body-2-semibold'],
    whiteSpace: 'nowrap',
  },
  variants: {
    active: {
      true: {
        color: atomic.common[0],
      },
    },
  },
});

export const actionsClassName = style({
  flexShrink: 0,
  gap: '1.6rem',
});

export const selectedActionClassName = style({
  gap: '1.6rem',
});

export const selectedCountClassName = style({
  ...typography['body-2-semibold'],
  display: 'inline-flex',
  alignItems: 'center',
  borderRight: `1px solid ${atomic.neutral[30]}`,
  padding: '0 1.6rem 0 0.4rem',
  color: atomic.neutral[70],
  whiteSpace: 'nowrap',
});

export const deleteButtonRecipe = recipe({
  base: {
    ...typography['body-2-semibold'],
    border: 0,
    padding: '0.4rem 1rem',
    color: atomic.neutral[30],
    cursor: 'default',
    whiteSpace: 'nowrap',
    selectors: {
      '&:disabled': {
        cursor: 'default',
      },
    },
  },
  variants: {
    active: {
      true: {
        color: semantic.status.negative,
        cursor: 'pointer',
      },
    },
  },
});

export const sortButtonClassName = style({
  display: 'inline-flex',
  height: '3.6rem',
  alignItems: 'center',
  gap: '0.1rem',
  border: 0,
  borderRadius: '2.8rem',
  padding: '1rem 1.6rem 1rem 2rem',
  backgroundColor: atomic.neutral[10],
});

export const sortButtonTextClassName = style({
  ...typography['body-3-medium'],
  color: atomic.neutral[50],
  whiteSpace: 'nowrap',
});

export const iconClassName = style({
  display: 'block',
  width: '1.6rem',
  height: '1.6rem',
  flexShrink: 0,
  border: `0.15rem dashed ${atomic.neutral[90]}`,
  borderRadius: '0.4rem',
});
