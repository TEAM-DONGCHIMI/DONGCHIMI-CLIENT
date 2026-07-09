import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

export const fieldRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  width: '100%',
  minWidth: 0,
});

export const root = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    transition: 'background-color 160ms ease, border-color 160ms ease',
  },
  variants: {
    size: {
      small: {
        height: 32,
        paddingBlock: 6,
        paddingInline: 12,
      },
      medium: {
        height: 40,
        gap: 10,
        paddingBlock: 10,
        paddingInline: 16,
      },
    },
    status: {
      default: {
        borderColor: atomic.neutral[20],
        backgroundColor: atomic.common[0],
        selectors: {
          '&:hover': {
            borderColor: atomic.neutral[80],
          },
          '&:focus-within': {
            borderColor: atomic.neutral[80],
          },
        },
      },
      error: {
        borderColor: semantic.status.negativeLight,
        backgroundColor: atomic.common[0],
      },
      readOnly: {
        borderColor: atomic.neutral[20],
        backgroundColor: atomic.neutral[20],
      },
    },
  },
  defaultVariants: {
    size: 'medium',
    status: 'default',
  },
});

export const errorMessage = style({
  ...typography['caption-1-medium'],
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  margin: 0,
  color: semantic.status.negative,
});

export const errorIcon = style({
  flexShrink: 0,
  width: 16,
  height: 16,
});

export const input = recipe({
  base: {
    appearance: 'none',
    flex: '1 1 auto',
    width: '100%',
    minWidth: 0,
    height: '100%',
    padding: 0,
    border: 0,
    outline: 0,
    color: atomic.neutral[90],
    backgroundColor: 'transparent',
    selectors: {
      '&::placeholder': {
        color: atomic.neutral[60],
        opacity: 1,
      },
      '&:read-only': {
        cursor: 'default',
      },
    },
  },
  variants: {
    readOnly: {
      false: {},
      true: {
        color: atomic.neutral[60],
      },
    },
    size: {
      small: typography['caption-1-medium'],
      medium: typography['body-3-medium'],
    },
  },
  defaultVariants: {
    readOnly: false,
    size: 'medium',
  },
});

export const unit = recipe({
  base: {
    flexShrink: 0,
    color: atomic.neutral[90],
    whiteSpace: 'nowrap',
  },
  variants: {
    readOnly: {
      false: {},
      true: {
        color: atomic.neutral[60],
      },
    },
    size: {
      small: typography['caption-1-medium'],
      medium: typography['body-3-medium'],
    },
  },
  defaultVariants: {
    readOnly: false,
    size: 'medium',
  },
});
