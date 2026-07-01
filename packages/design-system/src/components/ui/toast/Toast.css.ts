import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

export const toast = recipe({
  base: {
    ...typography['body-3-medium'],
    display: 'inline-flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    minWidth: '17.4rem',
    maxWidth: 'min(calc(100vw - 3.2rem), 36rem)',
    minHeight: '4.8rem',
    padding: '0 1.6rem',
    gap: '0.8rem',
    borderRadius: '999rem',
    color: atomic.common[0],
    boxShadow: '0 0.4rem 1.2rem rgba(25, 31, 40, 0.12)',
  },
  variants: {
    status: {
      completed: {
        backgroundColor: atomic.neutral[90],
      },
      error: {
        backgroundColor: semantic.status.negative,
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
  width: '2rem',
  height: '2rem',
  lineHeight: 0,
  color: 'currentColor',
});

export const toastMessageClassName = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
