import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const rootClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  minWidth: 0,
});

export const fieldClassName = style({
  ...typography['body-3-medium'],
  position: 'relative',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '4rem',
  minWidth: 0,
  padding: '1rem 1.6rem',
  overflow: 'hidden',
  border: `0.1rem solid ${atomic.neutral[20]}`,
  borderRadius: '0.4rem',
  backgroundColor: atomic.common[0],
  cursor: 'pointer',
  transition: 'border-color 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:hover': {
      borderColor: atomic.neutral[80],
    },
    '&:focus-within': {
      borderColor: atomic.neutral[80],
    },
  },
});

export const readOnlyFieldClassName = style({
  backgroundColor: atomic.neutral[20],
  color: atomic.neutral[60],
  cursor: 'default',
  selectors: {
    '&:hover': {
      borderColor: atomic.neutral[20],
    },
    '&:focus-within': {
      borderColor: atomic.neutral[20],
    },
  },
});

export const errorFieldClassName = style({
  borderColor: semantic.status.negativeLight,
  selectors: {
    '&:hover': {
      borderColor: semantic.status.negativeLight,
    },
    '&:focus-within': {
      borderColor: semantic.status.negativeLight,
    },
  },
});

export const valueClassName = style({
  color: atomic.neutral[90],
});

export const readOnlyValueClassName = style({
  color: atomic.neutral[60],
});

export const placeholderClassName = style({
  color: atomic.neutral[60],
});

export const nativeInputClassName = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
});

export const readOnlyNativeInputClassName = style({
  cursor: 'default',
});

export const errorMessageClassName = style({
  ...typography['caption-1-medium'],
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  margin: 0,
  color: semantic.status.negative,
});

export const errorIconClassName = style({
  flexShrink: 0,
  width: 16,
  height: 16,
});
