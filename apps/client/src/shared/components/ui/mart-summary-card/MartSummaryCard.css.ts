import { style } from '@vanilla-extract/css';

import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const martSummaryCardClassName = style({
  display: 'flex',
  width: '100%',
  maxWidth: '37.5rem',
  flexDirection: 'column',
  gap: '1.2rem',
  overflow: 'hidden',
  paddingLeft: '2rem',
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

export const locationMetaClassName = style({
  display: 'inline-flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.2rem',
  overflow: 'hidden',
});

// TODO: chip 컴포넌트 교체
export const discountChipClassName = style({
  ...typography['caption-2-medium'],
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '999rem',
  padding: '0.2rem 0.6rem',
  backgroundColor: semantic.primary.light,
  color: semantic.primary.strong,
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
  display: 'flex',
  gap: '0.6rem',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollSnapType: 'x proximity',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const productItemClassName = style({
  scrollSnapAlign: 'start',
});
