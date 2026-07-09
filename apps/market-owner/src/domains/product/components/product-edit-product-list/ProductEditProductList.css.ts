import { style } from '@vanilla-extract/css';

import { atomic, typography } from '@dongchimi/design-system/tokens';

export const sectionListClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '3.8rem',
});

export const categorySectionClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
});

export const categoryTitleClassName = style({
  ...typography['body-3-medium'],
  margin: 0,
  color: atomic.neutral[80],
});

export const productGridClassName = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 25.2rem))',
  gap: '1.6rem 2rem',
});
