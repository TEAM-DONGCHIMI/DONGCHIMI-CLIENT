import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const rootClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  height: '6.4rem',
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2.4rem',
  borderRight: `1px solid ${atomic.neutral[30]}`,
  borderBottom: `1px solid ${atomic.neutral[30]}`,
  borderLeft: `1px solid ${atomic.neutral[30]}`,
  borderBottomRightRadius: '1.2rem',
  borderBottomLeftRadius: '1.2rem',
  padding: '1.6rem 2.4rem',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  backgroundColor: atomic.common[0],
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const contentClassName = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '1.2rem',
  minWidth: 0,
});

export const summaryClassName = style({
  ...typography['body-3-regular'],
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  color: atomic.neutral[60],
  whiteSpace: 'nowrap',
});

export const summaryValueClassName = style({
  fontWeight: 400,
});

export const navigationClassName = style({
  flexShrink: 0,
});
