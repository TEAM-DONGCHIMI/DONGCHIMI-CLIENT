import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const queryStateClassName = style({
  ...typography['body-2-medium'],
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.2rem',
  backgroundColor: atomic.neutral[5],
  color: atomic.neutral[70],
  textAlign: 'center',
});

export const queryErrorMessageClassName = style({
  margin: 0,
});

export const actionButtonClassName = style({
  width: '19.4rem',
  minWidth: 0,
});

export const actionAreaClassName = style({
  justifyContent: 'flex-end',
  padding: 0,
  gap: '1.4rem',
});
