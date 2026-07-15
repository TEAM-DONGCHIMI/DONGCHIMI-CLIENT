import { style, styleVariants } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const listClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '1.6rem',
  margin: 0,
  padding: 0,
  color: atomic.neutral[90],
  listStyle: 'none',
});

export const itemClassName = style({
  boxSizing: 'border-box',
  display: 'grid',
  width: '100%',
  minWidth: 0,
  minHeight: '5.2rem',
  gridTemplateColumns: 'max-content minmax(0, 1fr) max-content',
  alignItems: 'center',
  columnGap: '0.8rem',
  borderRadius: 12,
  padding: '1.4rem 1.6rem',
});

export const itemStatusClassNames = styleVariants({
  completed: {
    border: '1px solid transparent',
    backgroundColor: atomic.neutral[10],
  },
  processing: {
    border: `1px solid ${atomic.neutral[30]}`,
    backgroundColor: atomic.common[0],
  },
  pending: {
    border: `1px solid ${atomic.neutral[10]}`,
    backgroundColor: atomic.common[0],
  },
});

export const iconWrapperClassName = style({
  display: 'inline-flex',
  width: '2.4rem',
  height: '2.4rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
});

export const iconClassName = style({
  display: 'block',
  width: '2.4rem',
  height: '2.4rem',
});

export const titleClassName = style({
  ...typography['body-3-medium'],
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const titleStatusClassNames = styleVariants({
  completed: {
    color: atomic.neutral[90],
  },
  processing: {
    color: atomic.neutral[90],
  },
  pending: {
    color: atomic.neutral[50],
  },
});

export const statusClassName = style({
  ...typography['caption-1-regular'],
  minWidth: 0,
  justifySelf: 'end',
  whiteSpace: 'nowrap',
});

export const statusTextClassNames = styleVariants({
  completed: {
    color: atomic.neutral[90],
  },
  processing: {
    color: atomic.neutral[60],
  },
  pending: {
    color: atomic.neutral[60],
  },
});
