import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const pageClassName = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[90],
});

export const logoClassName = style({
  width: 'auto',
  height: '100%',
  objectFit: 'contain',
});

export const homeHeaderClassName = style({
  margin: '0 1rem',
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
  outline: 'transparent',
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

export const mapSectionClassName = style({
  padding: '0 2rem',
});

export const mapAreaClassName = style({
  width: '100%',
  height: '314px',
});

export const mapStatusClassName = style({
  ...typography['caption-1-medium'],
  padding: '0.8rem 0 0',
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const marketInfoWindowClassName = style({
  ...typography['caption-1-medium'],
  padding: '0.6rem 1rem',
  color: atomic.neutral[90],
  whiteSpace: 'nowrap',
});

export const marketListSectionClassName = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '2rem',
  minHeight: 0,
  padding: '1.6rem 0',
});

export const marketListStatusClassName = style({
  ...typography['caption-1-medium'],
  padding: '2rem',
  color: atomic.neutral[60],
  textAlign: 'center',
});

export const marketListEmptyStateClassName = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  minHeight: 0,
  padding: '0 2rem',
});

export const marketListEmptyImageClassName = style({
  width: '9.1rem',
  height: '9.1rem',
  objectFit: 'contain',
});

export const marketListEmptyTextClassName = style({
  ...typography['body-2-medium'],
  width: '100%',
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
  textAlign: 'center',
  whiteSpace: 'pre-line',
  wordBreak: 'keep-all',
});

export const marketListSentinelClassName = style({
  width: '100%',
  height: '1px',
});
