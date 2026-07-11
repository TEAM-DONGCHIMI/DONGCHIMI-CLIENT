import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const contentClassName = style({
  width: '30.5rem',
  borderRadius: '1.2rem',
});

export const containerClassName = style({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.4rem',
  padding: '2rem',
  backgroundColor: atomic.common[0],
});

export const titleClassName = style({
  ...typography['body-2-semibold'],
  width: '100%',
  margin: 0,
  color: atomic.neutral[90],
  textAlign: 'center',
  whiteSpace: 'pre-line',
  wordBreak: 'keep-all',
});

export const buttonGroupClassName = style({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '0.8rem',
});

export const actionButtonClassName = style({
  minWidth: 0,
  flex: '1 1 0',
  paddingRight: '1.2rem',
  paddingLeft: '1.2rem',
});

export const cancelButtonClassName = style([
  actionButtonClassName,
  {
    borderColor: atomic.neutral[30],
    backgroundColor: atomic.neutral[30],
    color: atomic.common[0],
  },
]);
