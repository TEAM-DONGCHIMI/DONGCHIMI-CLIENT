import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '../../../tokens';

const focusOutlineColor = `color-mix(in srgb, ${semantic.primary.normal} 34%, transparent)`;

export const tabsRootClassName = style({
  display: 'block',
});

export const tabsListClassName = style({
  display: 'inline-flex',
  alignItems: 'flex-start',
  gap: '1.6rem',
});

export const tabItemClassName = style({
  ...typography['body-1-medium'],
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  minHeight: '5.1rem',
  padding: '1.2rem 0.2rem 0.8rem',
  border: 0,
  borderBottom: `0.2rem solid transparent`,
  backgroundColor: 'transparent',
  color: atomic.neutral[50],
  cursor: 'pointer',
  textAlign: 'center',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition:
    'border-color 160ms ease, color 160ms ease, opacity 160ms ease, outline-color 160ms ease',
  selectors: {
    '&[aria-current], &[aria-selected="true"], &[data-selected="true"]': {
      ...typography['body-1-semibold'],
      borderBottomColor: atomic.common[100],
      color: atomic.neutral[90],
    },
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
    '&:disabled, &[aria-disabled="true"]': {
      cursor: 'not-allowed',
      opacity: 0.45,
    },
  },
});

export const tabsPanelClassName = style({
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${focusOutlineColor}`,
      outlineOffset: 2,
    },
  },
});
