import { style, styleVariants } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

const SEARCH_ICON_SIZE = '1.6rem';

export const searchBarClassName = style({
  display: 'flex',
  width: '100%',
  maxWidth: '25.4rem',
  alignItems: 'center',
  gap: '0.8rem',
  border: `1px solid ${atomic.neutral[20]}`,
  borderRadius: 8,
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
  transition: 'border-color 130ms ease',

  selectors: {
    '&:not([data-error="true"]):hover': {
      borderColor: atomic.neutral[80],
    },
    '&:not([data-error="true"]):focus-within': {
      borderColor: atomic.neutral[80],
    },
    '&[data-error="true"]': {
      borderColor: semantic.status.negativeLight,
    },
  },
});

export const searchBarSizeClassNames = styleVariants({
  small: {
    minHeight: '4rem',
    padding: '1rem 1.6rem',
  },
  medium: {
    minHeight: '4.4rem',
    padding: '1rem 1.6rem',
  },
});

export const iconClassName = style({
  display: 'inline-flex',
  width: SEARCH_ICON_SIZE,
  height: SEARCH_ICON_SIZE,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
});

export const inputClassName = style({
  ...typography['body-3-regular'],
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
    },
    '&::-webkit-search-cancel-button': {
      display: 'none',
    },
    '&::-webkit-search-decoration': {
      display: 'none',
    },
  },
});
