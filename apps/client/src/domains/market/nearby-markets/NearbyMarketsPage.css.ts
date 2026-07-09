import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  minHeight: '100dvh',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

const checkerboardColor = 'rgba(229, 232, 235, 0.68)';

export const logoPlaceholderClassName = style({
  width: '100%',
  height: '100%',
  backgroundImage: `repeating-conic-gradient(from 90deg, ${checkerboardColor} 0 25%, transparent 0 50%)`,
  backgroundPosition: 'center top',
  backgroundSize: '0.8rem 0.8rem',
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

export const mapStatusClassName = style({
  ...typography['caption-1-medium'],
  padding: '0.8rem 2rem 0',
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const currentLocationMarkerClassName = style({
  width: '1.2rem',
  height: '1.2rem',
  borderRadius: '50%',
  backgroundColor: atomic.neutral[90],
  border: `0.2rem solid ${atomic.common[0]}`,
  boxShadow: `0 0 0 0.1rem ${atomic.neutral[40]}`,
});

export const marketInfoWindowClassName = style({
  ...typography['caption-1-medium'],
  padding: '0.6rem 1rem',
  color: atomic.neutral[90],
  whiteSpace: 'nowrap',
});

export const marketListSectionClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  padding: '1.6rem 0',
});

export const marketListStatusClassName = style({
  ...typography['caption-1-medium'],
  padding: '2rem',
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const marketListSentinelClassName = style({
  width: '100%',
  height: '1px',
});
