import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  minHeight: '100dvh',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const searchSectionClassName = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '1rem',
  padding: '2.4rem 2rem 1rem',
});

export const titleClassName = style({
  ...typography['body-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
  wordBreak: 'keep-all',
});

export const locationSearchFieldClassName = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.8rem',
  padding: '1.2rem',
  border: 0,
  borderRadius: '0.8rem',
  backgroundColor: atomic.neutral[10],
  color: atomic.neutral[60],
  cursor: 'text',

  selectors: {
    '&:focus-within': {
      boxShadow: `0 0 0 2px ${atomic.neutral[30]}`,
    },
  },
});

export const locationIconClassName = style({
  flexShrink: 0,
  width: '1.6rem',
  height: '1.6rem',
});

export const locationSearchInputClassName = style({
  ...typography['caption-1-medium'],
  width: '100%',
  minWidth: 0,
  overflow: 'hidden',
  padding: 0,
  border: 0,
  backgroundColor: 'transparent',
  color: atomic.neutral[60],
  letterSpacing: 0,
  outline: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  selectors: {
    '&::-webkit-search-cancel-button': {
      display: 'none',
    },
  },
});

export const visuallyHiddenClassName = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

export const mapAreaClassName = style({
  width: '100%',
  height: '314px',
  border: '0.707px solid #e5e7eb',
  backgroundColor: '#e8f0e4',
});
