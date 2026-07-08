import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const martSummaryCardClassName = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  gap: '1.2rem',
  overflow: 'hidden',
  paddingInline: '2rem',
});

export const headerClassName = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const profileGroupClassName = style({
  display: 'flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.9rem',
});

export const profileImageWrapperClassName = style({
  position: 'relative',
  width: '4.1rem',
  height: '4.1rem',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: '999rem',
  backgroundColor: atomic.neutral[20],
});

export const profileImageClassName = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const titleGroupClassName = style({
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
});

export const martNameClassName = style({
  ...typography['body-2-semibold'],
  minWidth: 0,
  overflow: 'hidden',
  margin: 0,
  color: atomic.neutral[90],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const metaRowClassName = style({
  ...typography['caption-1-regular'],
  display: 'flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.6rem',
  overflow: 'hidden',
  color: atomic.neutral[50],
  whiteSpace: 'nowrap',
});

export const statusMetaClassName = style({
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.2rem',
  overflow: 'hidden',
});

export const actionButtonClassName = style({
  width: '7.1rem',
  minWidth: '7.1rem',
  maxWidth: '7.1rem',
  height: '3.8rem',
  flexShrink: 0,
  padding: 0,
});

export const productScrollerClassName = style({
  marginRight: '-2rem',
  display: 'flex',
  gap: '0.6rem',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollSnapType: 'x proximity',
  scrollbarWidth: 'none',
  cursor: 'pointer',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const productItemClassName = style({
  scrollSnapAlign: 'start',
});
