import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const sectionClassName = style({
  minHeight: 'calc(100vh - 6.4rem)',
  gridTemplateRows: 'auto 1fr',
  gap: '8.8rem',
  boxSizing: 'border-box',
  padding: '3.2rem 4rem 6rem',
  backgroundColor: atomic.common[0],
  backgroundImage:
    'linear-gradient(45deg, rgba(25, 31, 40, 0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(25, 31, 40, 0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(25, 31, 40, 0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(25, 31, 40, 0.05) 75%)',
  backgroundPosition: '0 0, 0 4rem, 4rem -4rem, -4rem 0',
  backgroundSize: '8rem 8rem',
});

export const headingGroupClassName = style({
  gap: '0.4rem',
});

export const titleClassName = style({
  ...typography['heading-1-semibold'],
  margin: 0,
  color: atomic.neutral[90],
  letterSpacing: 0,
});

export const descriptionClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  color: atomic.neutral[60],
  letterSpacing: 0,
});
