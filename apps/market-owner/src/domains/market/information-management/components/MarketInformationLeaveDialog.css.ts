import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const contentClassName = style({
  width: '30.5rem',
  maxWidth: 'calc(100vw - 4.8rem)',
  boxSizing: 'border-box',
  borderRadius: '1.2rem',
});

export const containerClassName = style({
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.4rem',
  padding: '2rem',
  backgroundColor: atomic.common[0],
});

export const titleClassName = style({
  width: '100%',
  margin: 0,
  color: atomic.neutral[90],
  textAlign: 'center',
  ...typography['body-2-semibold'],
});

export const actionsClassName = style({
  display: 'flex',
  width: '100%',
  gap: '0.8rem',
});

export const buttonClassName = style({
  width: 0,
  minWidth: 0,
  flex: '1 1 0',
  boxSizing: 'border-box',
  padding: '1.2rem',
});
