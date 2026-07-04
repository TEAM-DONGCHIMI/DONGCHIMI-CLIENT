import { globalStyle, style } from '@vanilla-extract/css';

import { atomic, semantic } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const navigationClassName = style({
  display: 'inline-flex',
  minWidth: 0,
});

export const containerClassName = style({
  display: 'inline-flex',
  minHeight: '3.2rem',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
});

export const pageListClassName = style({
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.6rem',
  padding: '0 1.6rem',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const iconButtonClassName = style({
  appearance: 'none',
  display: 'inline-flex',
  width: '1.6rem',
  height: '1.6rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  borderRadius: '0.4rem',
  padding: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[50],
  transition: 'color 160ms ease, opacity 160ms ease, outline-color 160ms ease',
  selectors: {
    '&:hover': {
      color: atomic.neutral[90],
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.45,
    },
    '&:disabled:hover': {
      color: atomic.neutral[50],
    },
  },
});

export const iconClassName = style({
  display: 'inline-flex',
  width: '1.6rem',
  height: '1.6rem',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${iconClassName} > svg`, {
  width: '1.6rem',
  height: '1.6rem',
});

export const previousIconClassName = style({
  transform: 'rotate(180deg)',
});
