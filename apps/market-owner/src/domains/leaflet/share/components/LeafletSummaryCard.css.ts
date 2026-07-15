import { style } from '@vanilla-extract/css';

import { atomic, shadow, typography } from '@dongchimi/design-system/tokens';

export const cardClassName = style({
  width: '37.5rem',
  boxSizing: 'border-box',
  padding: '3rem 2rem 2.4rem',
  borderRadius: '1.2rem',
  backgroundColor: atomic.common[0],
  boxShadow: shadow.normal.medium,
});

export const titleClassName = style({
  ...typography['heading-3-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
});

export const summaryListClassName = style({
  gap: '0.8rem',
  margin: '1.8rem 0 2.4rem',
});

export const summaryTermClassName = style({
  ...typography['body-2-medium'],
  margin: 0,
  color: atomic.neutral[50],
  letterSpacing: 0,
});

export const summaryDescriptionClassName = style({
  ...typography['body-2-semibold'],
  margin: 0,
  color: atomic.neutral[80],
  letterSpacing: 0,
});

export const actionGroupClassName = style({
  gap: '0.8rem',
});
