import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minWidth: 0,
});

export const labelRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  minWidth: 0,
  marginBottom: 8,
});

export const label = style({
  ...typography['body-3-semibold'],
  minWidth: 0,
  overflowWrap: 'anywhere',
  color: atomic.neutral[90],
});

export const inputContainer = style({
  position: 'relative',
  width: '100%',
  minWidth: 0,
});

export const input = recipe({
  base: {
    ...typography['body-2-medium'],
    appearance: 'none',
    boxSizing: 'border-box',
    width: '100%',
    height: 48,
    minWidth: 0,
    padding: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    color: atomic.neutral[90],
    caretColor: atomic.common[100],
    outline: 'none',
    transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
    selectors: {
      '&::placeholder': {
        color: atomic.neutral[60],
        opacity: 1,
      },
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    status: {
      default: {
        borderColor: atomic.neutral[20],
        backgroundColor: atomic.common[0],
        selectors: {
          '&:not(:disabled):hover': {
            borderColor: atomic.neutral[80],
          },
          '&:focus:not(:hover)': {
            borderColor: semantic.primary.normal,
          },
        },
      },
      error: {
        borderColor: semantic.status.negativeLight,
        backgroundColor: atomic.common[0],
        selectors: {
          '&:not(:disabled):hover': {
            borderColor: semantic.status.negativeLight,
          },
          '&:focus': {
            borderColor: semantic.status.negativeLight,
          },
        },
      },
      success: {
        borderColor: atomic.neutral[20],
        backgroundColor: atomic.neutral[20],
        selectors: {
          '&:focus-visible': {
            borderColor: atomic.neutral[80],
          },
        },
      },
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

export const inputWithTrailingElement = style({
  paddingRight: 44,
});

const trailingElement = style({
  position: 'absolute',
  top: '50%',
  right: 12,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  fontSize: 24,
  lineHeight: 0,
  transform: 'translateY(-50%)',
});

export const trailingIcon = style([
  trailingElement,
  {
    pointerEvents: 'none',
  },
]);

export const trailingAction = style([trailingElement]);

export const messageRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  minWidth: 0,
  minHeight: 18,
  marginTop: 4,
});

export const errorIconSlot = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  fontSize: 16,
  lineHeight: 0,
});

export const messageText = recipe({
  base: {
    ...typography['caption-1-medium'],
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  variants: {
    tone: {
      helper: {
        color: atomic.neutral[40],
      },
      error: {
        color: semantic.status.negative,
      },
    },
  },
  defaultVariants: {
    tone: 'helper',
  },
});
