import { style } from '@vanilla-extract/css';

import { atomic, shadow, typography } from '@dongchimi/design-system/tokens';

export const cardClassName = style({
  width: 'min(67.2rem, 100%)',
  alignSelf: 'center',
  boxSizing: 'border-box',
  gap: '2.2rem',
  marginBlock: 'auto',
  padding: '3.9rem',
  borderRadius: '2.4rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
});

export const headerClassName = style({
  gap: '0.8rem',
});

export const titleClassName = style({
  ...typography['heading-2-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
  textAlign: 'center',
});

export const descriptionClassName = style({
  ...typography['body-3-regular'],
  margin: 0,
  color: atomic.neutral[50],
  letterSpacing: 0,
  textAlign: 'center',
});

export const fileNameBoxClassName = style({
  width: '100%',
  minHeight: '8.5rem',
  boxSizing: 'border-box',
  padding: '2rem',
  borderRadius: '2rem',
  backgroundColor: atomic.neutral[10],
});

export const fileNameClassName = style({
  ...typography['body-1-medium'],
  maxWidth: '100%',
  overflow: 'hidden',
  color: atomic.neutral[70],
  letterSpacing: 0,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const fileNameEmptyClassName = style([
  fileNameClassName,
  {
    color: atomic.neutral[50],
  },
]);

export const analysisInfoClassName = style({
  gap: '1.6rem',
});

export const analysisItemRowClassName = style({
  maxWidth: '100%',
  gap: '1.8rem',
});

export const analysisItemLabelClassName = style({
  ...typography['caption-1-medium'],
  flexShrink: 0,
  color: atomic.neutral[80],
  letterSpacing: 0,
  whiteSpace: 'nowrap',
});

export const analysisItemListClassName = style({
  minWidth: 0,
  gap: '0.4rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const analysisItemClassName = style({
  ...typography['caption-1-medium'],
  display: 'inline-flex',
  minHeight: '2.1rem',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  padding: '0.2rem 0.8rem',
  borderRadius: '0.4rem',
  backgroundColor: atomic.neutral[10],
  color: atomic.neutral[70],
  letterSpacing: 0,
  whiteSpace: 'nowrap',
});

export const actionRowClassName = style({
  gap: '1.4rem',
});

export const actionButtonClassName = style({
  ...typography['body-3-semibold'],
  width: '12rem',
  minWidth: '12rem',
  height: '4.4rem',
  padding: '1.2rem 2.4rem',
  letterSpacing: 0,
});

export const visuallyHiddenClassName = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  border: 0,
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
});
