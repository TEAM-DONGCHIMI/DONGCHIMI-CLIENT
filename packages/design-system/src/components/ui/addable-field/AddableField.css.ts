import { style } from '@vanilla-extract/css';

import { recipe } from '../../../styles/recipe';
import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

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
  marginBottom: 6,
});

export const label = style({
  ...typography['body-3-semibold'],
  minWidth: 0,
  overflowWrap: 'anywhere',
  color: atomic.neutral[90],
});

export const requiredMark = style({
  ...typography['body-2-regular'],
  flexShrink: 0,
  color: semantic.primary.strong,
});

export const field = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: 48,
    minWidth: 0,
    gap: 8,
    padding: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: atomic.common[0],
    color: atomic.neutral[90],
    transition: 'border-color 160ms ease',
    selectors: {
      '&[data-disabled]': {
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    status: {
      default: {
        borderColor: atomic.neutral[20],
        selectors: {
          '&:not([data-disabled]):hover': {
            borderColor: atomic.neutral[80],
          },
          '&:not([data-disabled]):focus-within': {
            borderColor: atomic.neutral[80],
          },
        },
      },
      error: {
        borderColor: semantic.status.negativeLight,
      },
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  fontSize: 20,
  lineHeight: 0,
  pointerEvents: 'none',
});

export const input = style({
  ...typography['body-3-medium'],
  appearance: 'none',
  flex: '1 1 auto',
  width: '100%',
  minWidth: 0,
  border: 0,
  padding: 0,
  outline: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[90],
  caretColor: atomic.neutral[90],
  selectors: {
    '&::placeholder': {
      color: atomic.neutral[60],
      opacity: 1,
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

export const actionButton = style({
  appearance: 'none',
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  margin: -2,
  border: 0,
  padding: 0,
  borderRadius: 4,
  outline: 0,
  backgroundColor: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

export const messageRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  minWidth: 0,
  minHeight: 18,
  marginTop: 12,
});

export const errorIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  fontSize: 16,
  lineHeight: 0,
});

export const messageText = style({
  ...typography['caption-1-medium'],
  minWidth: 0,
  overflowWrap: 'anywhere',
  color: semantic.status.negative,
});
