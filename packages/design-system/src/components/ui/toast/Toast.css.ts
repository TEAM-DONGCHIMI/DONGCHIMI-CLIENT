import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic } from '../../../tokens';

export const toast = recipe({
  base: {
    fontFamily: '"Pretendard", sans-serif',
    fontSize: '1.4rem',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '-0.028rem',
    display: 'inline-flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '17.4rem',
    maxWidth: 'calc(100vw - 3.2rem)',
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
  lineHeight: 0,
  color: '#171719',
});

export const toastDefaultIconClassName = style({
  display: 'block',
  boxSizing: 'border-box',
  width: '1.93rem',
  height: '1.93rem',
  border: '0.2rem dashed #171719',
  borderRadius: '0.6rem',
});

export const toastMessageClassName = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
