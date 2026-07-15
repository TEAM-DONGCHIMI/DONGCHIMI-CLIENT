import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const sectionClassName = style({
  minHeight: 'calc(100vh - 6.4rem)',
  alignContent: 'start',
  gap: '6.4rem',
  boxSizing: 'border-box',
  padding: '3.2rem 4rem',
});

export const headingGroupClassName = style({
  gap: '0.4rem',
});

export const titleClassName = style({
  ...typography['heading-2-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
});

export const descriptionClassName = style({
  ...typography['body-3-regular'],
  margin: 0,
  color: atomic.neutral[60],
  letterSpacing: 0,
});

export const contentClassName = style({
  gridTemplateColumns: '37.5rem 30rem',
  justifyContent: 'center',
  gap: '8rem',
});

export const stateClassName = style({
  minHeight: '36rem',
  borderRadius: '1.2rem',
  backgroundColor: atomic.common[0],
  color: atomic.neutral[70],
  textAlign: 'center',
});

export const stateMessageClassName = style({
  ...typography['body-2-medium'],
  margin: 0,
  color: atomic.neutral[70],
  letterSpacing: 0,
});
