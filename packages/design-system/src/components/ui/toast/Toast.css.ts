import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

export const toast = recipe({
  base: {
    ...typography['body-3-regular'],
    display: 'inline-flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: 'fit-content',
    minWidth: '18.4rem',
    maxWidth: 'min(33.4rem, calc(100vw - 3.2rem))',
    minHeight: '4.8rem',
    padding: '1.2rem 1.8rem',
    gap: '0.4rem',
    borderRadius: '0.8rem',
    color: atomic.common[0],
  },
  variants: {
    status: {
      completed: {
        backgroundColor: atomic.neutral[90],
      },
      error: {
        backgroundColor: semantic.status.negativeLight,
      },
    },
  },
  defaultVariants: {
    status: 'completed',
  },
});

export const toastIconClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.4rem',
  height: '2.4rem',
  fontSize: '2.4rem',
  lineHeight: 0,
  color: atomic.common[100],
});

export const toastErrorIconClassName = style({
  color: atomic.common[0],
});

export const toastMessageClassName = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
